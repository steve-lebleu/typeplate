import { expectationFailed } from 'boom';
import * as Jimp from 'jimp';

import { Response } from 'express';
import { jimp as JimpConfiguration } from '@config/environment.config';
import { IMAGE_MIME_TYPE } from '@enums/mime-type.enum';
import { MulterConfiguration } from '@config/multer.config';
import { IUploadOptions } from '@interfaces/IUploadOptions.interface';
import { IFileRequest } from '@interfaces/IFileRequest.interface';
import { clone } from 'lodash';
import { UploadError } from '@errors/upload-error';
import { IResponse } from '@interfaces/IResponse.interface';
import { IFile } from '@interfaces/IFile.interface';

/**
 * Uploading middleware
 */
export class Uploader {

  static configuration = new MulterConfiguration();

  constructor() { }

  /**
   * @description Upload multiple files
   *
   * @param options Upload parameters (destination, maxFileSize, wildcards)
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  static uploadMultiple = ( options?: IUploadOptions ) => (req: IFileRequest, res: IResponse, next: (error?: Error) => void): void => {
    const middleware = Uploader.configuration.multer( Uploader.configuration.get(options) ).any() as (req, res, err) => void;
    middleware(req, res, (err: Error) => {
      if(err) {
        return next(new UploadError(err));
      } else if (typeof req.files === 'undefined') {
        return next(new UploadError(new Error('Binary data cannot be found')));
      }
      req.body.files = req.files
        .slice(0, Uploader.configuration.options.maxFiles)
        .map( ( file: { owner: number } ) => {
          file.owner = req.user.id;
          return file;
        }) || [];
      next();
    });
  };

  /**
   * @description Upload single file
   *
   * @param options Upload parameters (destination, maxFileSize, wildcards)
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  static upload = ( options?: IUploadOptions ) => (req: IFileRequest, res: IResponse, next: (error?: Error) => void): void => {
    if ( typeof res.locals.data === 'undefined' ) {
      return next(new UploadError(new Error('Original data cannot be found')));
    }
    const middleware = Uploader.configuration.multer( Uploader.configuration.get(options) ).single(res.locals.data.fieldname) as (req, res, err) => void;
    middleware(req, res, (err: Error) => {
      if(err) {
        return next(new UploadError(err));
      } else if (typeof req.file === 'undefined') {
        return next(new UploadError(new Error('Binary data cannot be found')));
      }
      req.body.file = req.file || {};
      req.body.file.owner = req.user.id;
      next();
    });
  };

  /**
   * @description Resize image according to .env file directives
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  static resize = (req: IFileRequest, res: Response, next: (e?: Error) => void): void => {

    if ( JimpConfiguration.isActive === 1 ) {

      const entries = [].concat(req.files || req.file);

      if ( entries.filter( ( file: IFile ) => IMAGE_MIME_TYPE.hasOwnProperty(file.mimetype)).length === 0 ) {
        return next();
      }

      entries.forEach( (file: IFile) => {
        const target = clone(file.destination) as string;
        const towards = target.split('/'); towards.pop(); towards.push('rescale');
        const destination = towards.join('/');

        // Read original file
        void Jimp.read(file.path)
          .then( (image) => {
            const configs = [
              { size: JimpConfiguration.xs, segment: 'extra-small' },
              { size: JimpConfiguration.md, segment: 'medium' },
              { size: JimpConfiguration.xl, segment: 'extra-large' }
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

}