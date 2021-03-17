import * as Pluralize from 'pluralize';
import { MulterError } from 'multer';

import { SCALING } from '@config/environment.config';
import { UploadConfiguration } from '@config/upload.config'

import { IMediaRequest, IResponse, IUploadOptions, IMedia } from '@interfaces';

import { getTypeOfMedia } from '@utils/string.util';

/**
 * @description
 */
 class Uploader {

  /**
   * @description
   */
  private static instance: Uploader;

  /**
   * @description
   */
  private options: IUploadOptions;

  private constructor(options: IUploadOptions) {
    this.options = options;
  }

  /**
   * @description
   */
  static get(options: IUploadOptions): Uploader {
    if (!Uploader.instance) {
      Uploader.instance = new Uploader(options);
    }
    return Uploader.instance;
  }

  /**
   * @description Uploader file(s) middleware
   *
   * @param options Uploader parameters (destination, maxFileSize, wildcards)
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  upload = ( options?: IUploadOptions ) => async (req: IMediaRequest, res: IResponse, next: (error?: Error) => void): Promise<void> => {

    this.options = options ? Object.keys(options)
      .filter(key => this.options[key])
      .reduce((acc: IUploadOptions, current: string) => {
        acc[current] = options[current] as string|number|Record<string,unknown>;
        return acc;
      }, this.options) : this.options;

    if (!req || !res || !this.options) {
      return next(new Error('Middleware requirements not found'))
    }

    const middleware = UploadConfiguration.engine( UploadConfiguration.configuration(this.options) ).any();

    middleware(req, res, (err: Error) => {
      if(err) {
        // console.log('ERR', err);
        return next(err instanceof MulterError ? err : new MulterError(err.message) );
      } else if (typeof req.files === 'undefined') {
        return next(new Error('Binary data cannot be found'));
      }
      req.body.files = req.files
        .slice(0, this.options.maxFiles)
        .map( ( media: IMedia ) => {
          const type = Pluralize(getTypeOfMedia(media.mimetype)) as string;
          media.owner = req.user.id;
          media.url = `${type}s/${type === 'image' ? `${SCALING.PATH_MASTER}/` : ''}${media.filename}`
          return media;
        }) || [];
      next();
    });
  }

}

const upload = Uploader.get(UploadConfiguration.options);

export { upload as Uploader };