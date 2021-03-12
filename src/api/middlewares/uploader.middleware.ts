import * as Multer from 'multer';
import * as Pluralize from 'pluralize';
import * as filenamify from 'filenamify';

import { MulterError } from 'multer';
import { unsupportedMediaType } from '@hapi/boom';

import { UPLOAD, SCALING } from '@config/environment.config';

import { IMediaRequest } from '@interfaces/IMediaRequest.interface';
import { IResponse } from '@interfaces/IResponse.interface';
import { IUploadMulterOptions } from '@interfaces/IUploadMulterOptions.interface';
import { IUploadOptions } from '@interfaces/IUploadOptions.interface';
import { IMedia } from '@interfaces/IMedia.interface';
import { IStorage } from '@interfaces/IStorage.interface';
import { IUpload } from '@interfaces/IUpload.interface';

import { foldername, extension, fieldname } from '@utils/string.util';
import { IMAGE_MIME_TYPE } from '@enums/mime-type.enum';

/**
 * File upload middleware
 */
export class Uploader {

  private static instance: (options?) => IUpload;

  /**
   * @description Default options
   */
  private static default: IUploadOptions = { destination: UPLOAD.PATH, maxFiles: UPLOAD.MAX_FILES, filesize: UPLOAD.MAX_FILE_SIZE, wildcards: UPLOAD.WILDCARDS};

  constructor() { }

  /**
   * @description
   */
  static get(): () => IUpload {
    if (!Uploader.instance) {
      Uploader.instance = Multer as (options?) => IUpload
    }
    return Uploader.instance;
  }

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

    const middleware = Uploader.instance( Uploader.configuration(opts) ).any();

    middleware(req, res, (err: Error) => {
      if(err) {
        return next(err instanceof MulterError ? err : new MulterError(err.message) );
      } else if (typeof req.files === 'undefined') {
        return next(new Error('Binary data cannot be found'));
      }
      req.body.files = req.files
        .slice(0, opts.maxFiles)
        .map( ( media: IMedia ) => {
          const type = Pluralize(fieldname(media.mimetype)) as string;
          media.owner = req.user.id;
          media.url = `${type}/${type === 'image' ? `${SCALING.PATH_MASTER}/` : ''}${media.filename}`
          return media;
        }) || [];
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
        if (IMAGE_MIME_TYPE[file.mimetype]) {
          towards += `/${SCALING.PATH_MASTER}`;
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

Uploader.get();