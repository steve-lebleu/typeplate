import * as Multer from 'multer';
import * as Pluralize from 'pluralize';
import * as filenamify from 'filenamify';

import { unsupportedMediaType, entityTooLarge } from 'boom';

import { jimp as JimpConfiguration, upload } from '@config/environment.config';

import { IMediaRequest } from '@interfaces/IMediaRequest.interface';
import { IResponse } from '@interfaces/IResponse.interface';
import { IUploadMulterOptions } from '@interfaces/IUploadMulterOptions.interface';
import { IUploadOptions } from '@interfaces/IUploadOptions.interface';
import { IMedia } from '@interfaces/IMedia.interface';

import { UploadError } from '@errors/upload-error';
import { foldername, extension, fieldname } from '@utils/string.util';
import { IMAGE_MIME_TYPE } from '@enums/mime-type.enum';

import { MEDIA_EVENT_EMITTER } from '@events/media.event';

interface IMulter {
  diskStorage: ( { destination, filename } ) => IStorage;
  any: () => ( req, res, next ) => void;
}

interface IStorage {
  getFilename: () => string;
  getDestination: () => string;
}

/**
 * File upload middleware
 */
export class Uploader {

  static instance: (options?) => IMulter;

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

    console.log('UPLOAD');

    if (!Uploader.instance) {
      Uploader.instance = Multer as (options?) => IMulter
    }

    const opts = options ? Object.keys(options)
      .filter(key => Uploader.default[key])
      .reduce((acc: IUploadOptions, current: string) => {
        acc[current] = options[current] as string|number|Record<string,unknown>;
        return acc;
      }, Uploader.default) : Uploader.default;

    const middleware = Uploader.instance( Uploader.configuration(opts) ).any();
      
    console.log('MIDDLEWARE IS SET');
    middleware(req, res, (err: Error) => {
      if(err) {
        console.log('UPLOADER MIDDLEWARE ERROR', err)
        return next(new UploadError(err));
      } else if (typeof req.files === 'undefined') {
        console.log('BINARY DATA NOT FOUND')
        return next(new UploadError(new Error('Binary data cannot be found')));
      }
      console.log('NO ERROR IN MIDDLEWARE UPLOAD')
      req.body.files = req.files
        .slice(0, opts.maxFiles)
        .map( ( media: IMedia ) => {
          const type = Pluralize(fieldname(media.mimetype)) as string;
          media.owner = req.user.id;
          media.url = `${type}/${type === 'image' ? 'master-copy/' : ''}${media.filename}`
          return media;
        }) || [];

        const images = req.files.filter( ( file: IMedia ) => IMAGE_MIME_TYPE.hasOwnProperty(file.mimetype));
        if ( JimpConfiguration.isActive === 1 && images.length > 0 ) {
          MEDIA_EVENT_EMITTER.emit('media.resize', images);
        }
      next();
    });
  }

  /**
   * @description Set Multer instance
   *
   * @param destination Directory where file will be uploaded
   * @param filesize Max file size authorized
   * @param wildcards Array of accepted mime types
   */
  private static configuration( options?: IUploadOptions ): IUploadMulterOptions {
    return {
      storage: Uploader.storage(options.destination),
      limits: {
        fileSize: options.filesize
      },
      fileFilter: (req: Request, file: IMedia, next: (e?: Error, v?: any) => void) => {
        if(options.wildcards.filter( mime => file.mimetype === mime ).length === 0) {
          return next( unsupportedMediaType('File mimetype not supported'), false );
        }
        return next(null, true);
      }
    };
  }

  /**
   * @description Set storage config
   * @param destination As main destination
   */
   private static storage(destination?: string): IStorage {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return Multer.diskStorage({
      destination: (req: Request, file: IMedia, next: (e?: Error, v?: any) => void) => {
        let towards = `${destination}/${Pluralize(fieldname(file.mimetype)) as string}`;
        if (typeof IMAGE_MIME_TYPE[file.mimetype] !== 'undefined') {
          towards += '/master-copy';
        }
        next(null, towards);
      },
      filename: (req: Request, file: IMedia, next: (e?: Error, v?: any) => void) => {
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
    }) as IStorage;
  }

}