
import * as Jimp from 'jimp';
import * as Multer from 'multer';
import * as Pluralize from 'pluralize';
import * as filenamify from 'filenamify';
import { Response } from 'express';
import { clone } from 'lodash';

import { jimp as JimpConfiguration } from '@config/environment.config';

import { IMediaRequest } from '@interfaces/IMediaRequest.interface';

import { UploadError } from '@errors/upload-error';
import { IResponse } from '@interfaces/IResponse.interface';


import { unsupportedMediaType, expectationFailed, entityTooLarge } from 'boom';
import { IUploadMulterOptions } from '@interfaces/IUploadMulterOptions.interface';
import { IUploadOptions } from '@interfaces/IUploadOptions.interface';
import { upload } from '@config/environment.config';
import { foldername, extension, fieldname } from '@utils/string.util';
import { IMAGE_MIME_TYPE } from '@enums/mime-type.enum';
import { IFile } from '@interfaces/IFile.interface';

import { IMedia } from '@interfaces/IMedia.interface';

interface IMulter {
  diskStorage: ( { destination, filename } ) => void;
  // eslint-disable-next-line id-blacklist
  any: () => void;
  single: () => void;
}


/**
 * File upload middleware
 */
export class Uploader {

  static instance: IMulter = Multer as IMulter;

  /**
   * @description Default options
   */
  static default: IUploadOptions = {
    destination: upload.path,
    filesize: upload.maxFileSize, // 1000000 bytes = 0,95367 Mo
    wildcards: upload.wildcards,
    maxFiles: upload.maxFiles
  };

  constructor() { }

  /**
   * @description Upload file(s)
   *
   * @param options Upload parameters (destination, maxFileSize, wildcards)
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  static upload = ( options?: IUploadOptions ) => (req: IMediaRequest, res: IResponse, next: (error?: Error) => void): void => {
    const opts = options ? Object.keys(options)
      .filter(key => Uploader.default[key])
      .reduce((acc: IUploadOptions, current: string) => {
        acc[current] = options[current] as string|number|Record<string,unknown>;
        return acc;
      }, Uploader.default) : Uploader.default;
    const middleware = Uploader.instance( Uploader.cfg(opts) ).any() as (req, res, err) => void;
    middleware(req, res, (err: Error) => {
      if(err) {
        return next(new UploadError(err));
      } else if (typeof req.files === 'undefined') {
        return next(new UploadError(new Error('Binary data cannot be found')));
      }
      req.body.files = req.files
        .slice(0, opts.maxFiles)
        .map( ( media: IMedia ) => {
          const type = fieldname(media.mimetype);
          media.owner = req.user.id;
          media.url = `${type}/${type === 'image' ? 'master-copy/' : ''}${media.filename}`
          return media;
        }) || [];
      next();
    });
  }

  /**
   * @description Resize image according to .env file directives
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  static resize = (req: IMediaRequest, res: Response, next: (e?: Error) => void): void => {

    if ( JimpConfiguration.isActive === 1 ) {

      const entries = [].concat(req.files);

      if ( entries.filter( ( file: IFile ) => IMAGE_MIME_TYPE.hasOwnProperty(file.mimetype)).length === 0 ) {
        return next();
      }

      entries.forEach( (file: IFile) => {
        const target = clone(file.destination) as string;
        const towards = target.split('/'); towards.pop(); towards.push('rescale');
        const destination = towards.join('/');

        // Read original file
        // TODO: récupérer dynamiquement
        void Jimp.read(file.path)
          .then( (image) => {
            const configs = [
              { size: JimpConfiguration.xs, segment: 'xs' },
              { size: JimpConfiguration.s, segment: 's' },
              { size: JimpConfiguration.md, segment: 'm' },
              { size: JimpConfiguration.l, segment: 'l' },
              { size: JimpConfiguration.xl, segment: 'xl' }
            ];
            configs.forEach( cfg => {
              image
                .clone()
                .resize(cfg.size, Jimp.AUTO)
                .write( `${destination}/${cfg.segment}/${file.filename}`, (err: Error) => {
                  if(err) throw expectationFailed(err.message);
                });
            });
          })
          .catch();
      });

    }
    next();
  };

  /**
   * @description Set storage config
   * @param destination As main destination
   */
  private static storage(destination?: string): void {
    return Uploader.instance.diskStorage({
      destination: (req: Request, file: IFile, next: (e?: Error, v?: any) => void) => {
        let towards = `${destination}/${Pluralize(fieldname(file.mimetype)) as string}`;
        if (typeof IMAGE_MIME_TYPE[file.mimetype] !== 'undefined') {
          towards += '/master-copy';
        }
        next(null, towards);
      },
      filename: (req: Request, file: IFile, next: (e?: Error, v?: any) => void) => {
        const name = filenamify( foldername(file.originalname), { replacement: '-', maxLength: 123 } )
          .replace(' ', '-')
          .replace('_', '-')
          .toLowerCase()
          .concat('-')
          .concat(Date.now().toString())
          .concat('.')
          .concat(extension(file.originalname).toLowerCase());
        next(null, name);
      }
    });
  }

  /**
   * @description Set Multer instance
   *
   * @param destination Directory where file will be uploaded
   * @param filesize Max file size authorized
   * @param wildcards Array of accepted mime types
   */
  private static cfg( options?: IUploadOptions ): IUploadMulterOptions {
    return {
      storage: Uploader.storage(options.destination),
      limits: {
        fileSize: options.filesize
      },
      fileFilter: (req: Request, file: IFile, next: (e?: Error, v?: any) => void) => {
        if(options.wildcards.filter( mime => file.mimetype === mime ).length === 0) {
          return next( unsupportedMediaType('File mimetype not supported'), false );
        }
        if (file.size > upload.maxFileSize) {
          return next( entityTooLarge(`File too large : max file size is ${upload.maxFileSize} 'ko`), false );
        }
        return next(null, true);
      }
    };
  }
}