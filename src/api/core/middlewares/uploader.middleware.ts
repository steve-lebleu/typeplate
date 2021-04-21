import { MulterError } from 'multer';

import { UploadConfiguration } from '@config/upload.config'
import { Media } from '@models/media.model';
import { IMediaRequest, IResponse, IUploadOptions, IMedia } from '@interfaces';

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
   *
   * @fixme many files with the same fieldname is not managed if not media route
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
        return next(err instanceof MulterError ? err : new MulterError(err.message) );
      } else if (typeof req.files === 'undefined') {
        if (req.url.includes('medias')) {
          return next(new Error('Binary data cannot be found'));
        }
        return next();
      }

      if (req.baseUrl.includes('medias')) {
        Object.keys(req.body)
          .filter(key => key !== 'files')
          .forEach(key => {
            delete req.body[key];
          });
        req.body.files = req.files
          .slice(0, this.options.maxFiles)
          .map( ( media: IMedia ) => {
            media.owner = req.user.id;
            delete media.originalname;
            delete media.encoding;
            delete media.destination;
            return media;
          }) || [];
      } else {
        req.files
          .reduce((acc, current) => {
            if (!acc.includes(current.fieldname)) {
              acc.push(current.fieldname);
            }
            return acc;
          }, [] as string[])
          .forEach(field => {
            const media = req.files.find(file => file.fieldname = field);
            req.body[field] = new Media({
              fieldname: media.fieldname,
              filename: media.filename,
              owner: req.user.id,
              mimetype: media.mimetype,
              size: media.size,
              path: media.path
            });
          });
      }
      next();
    });
  }

}

const upload = Uploader.get(UploadConfiguration.options);

export { upload as Uploader };