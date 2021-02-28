import { expectationFailed } from 'boom';
import * as Jimp from 'jimp';

import { Response } from 'express';
import { getRepository } from 'typeorm';
import { Document } from '@models/document.model';
import { jimp as JimpConfiguration } from '@config/environment.config';
import { IMAGE_MIME_TYPE } from '@enums/mime-type.enum';
import { MulterConfiguration } from '@config/multer.config';
import { IUpload } from '@interfaces/IUpload.interface';
import { IFileRequest } from '@interfaces/IFileRequest.interface';
import { clone } from 'lodash';
import { UploadError } from '@errors/upload-error';

/**
 * Uploading middleware
 */
export class Uploader {

  static configuration = new MulterConfiguration();

  constructor() { }

  /**
   * @description Create Document and append it to req
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  static create = (req: IFileRequest, res: Response, next: Function) => {
    try {
      const documentRepository = getRepository(Document);
      const document = new Document(req.file);
      documentRepository.save(document);
      req.doc = document;
      return next();
    } catch (e) {
 return next( expectationFailed(e.message) );
}
  };

  /**
   * @description Upload multiple files
   *
   * @param options Upload parameters (destination, maxFileSize, wildcards)
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  static uploadMultiple = ( options?: IUpload ) => (req: IFileRequest, res: Response, next: Function) => {
    const middleware = Uploader.configuration.multer( Uploader.configuration.get(options) ).any();
    middleware(req, res, function(err) {
      if(err) {
        return next(new UploadError(err));
      } else if (typeof req.files === 'undefined') {
        return next(new UploadError(new Error('Binary data cannot be found')));
      }
      req.body.files = req.files
        .slice(0, Uploader.configuration.options.maxFiles)
        .map( file => {
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
  static upload = ( options?: IUpload ) => (req: IFileRequest, res: Response, next: Function) => {
    if ( typeof res.locals.data === 'undefined' ) {
      return next(new UploadError(new Error('Original data cannot be found')));
    }
    const middleware = Uploader.configuration.multer( Uploader.configuration.get(options) ).single(res.locals.data.fieldname);
    middleware(req, res, function(err) {
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
  static resize = async (req: IFileRequest, res: Response, next: Function) => {

    const entries = [].concat(req.files || req.file);

    if ( entries.filter( file => IMAGE_MIME_TYPE.hasOwnProperty(file.mimetype)).length === 0 ) {
      return next();
    }

    // If image optimization is activated and current upload is image mime type
    if ( JimpConfiguration.isActive === 1 ) {

      entries.forEach( async (file: any) => {

        const towards = clone(file.destination).split('/'); towards.pop(); towards.push('rescale');

        const destination = towards.join('/');

        // Read original file
        const image = await Jimp.read(file.path);

        // Clone in 3 files according to 3 sizes
        const xsImage = image.clone(); const mdImage = image.clone(); const xlImage = image.clone();

        // Resize and write file in server
        xsImage
          .resize(JimpConfiguration.xs, Jimp.AUTO)
          .write( destination + '/extra-small/' + file.filename, function(err, doc){
            if(err) throw expectationFailed(err.message);
          });

        mdImage
          .resize(JimpConfiguration.md, Jimp.AUTO)
          .write( destination + '/medium/' + file.filename, function(err, doc){
            if(err) throw expectationFailed(err.message);
          });

        xlImage
          .resize(JimpConfiguration.xl, Jimp.AUTO)
          .write( destination + '/extra-large/' + file.filename, function(err, doc){
            if(err) throw expectationFailed(err.message);
          });

      });

    }

    next();
  };

}