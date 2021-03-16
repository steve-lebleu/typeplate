import * as Pluralize from 'pluralize';
import { MulterError } from 'multer';

import { SCALING } from '@config/environment.config';
import { UploadConfiguration } from '@config/upload.config'

import { IMediaRequest, IResponse, IUploadOptions, IMedia } from '@interfaces';

import { getTypeOfMedia } from '@utils/string.util';

/**
 * @description Upload file(s) middleware
 *
 * @param options Upload parameters (destination, maxFileSize, wildcards)
 *
 * @param req Express request object derived from http.incomingMessage
 * @param res Express response object
 * @param next Callback function
 */
const Upload = ( options?: IUploadOptions ) => (req: IMediaRequest, res: IResponse, next: (error?: Error) => void): void => {
  const opts = options ? Object.keys(options)
    .filter(key => UploadConfiguration.options[key])
    .reduce((acc: IUploadOptions, current: string) => {
      acc[current] = options[current] as string|number|Record<string,unknown>;
      return acc;
    }, UploadConfiguration.options) : UploadConfiguration.options;

  const middleware = UploadConfiguration.engine( UploadConfiguration.configuration(opts) ).any();

  middleware(req, res, (err: Error) => {
    if(err) {
      // console.log('ERR', err);
      return next(err instanceof MulterError ? err : new MulterError(err.message) );
    } else if (typeof req.files === 'undefined') {
      return next(new Error('Binary data cannot be found'));
    }
    req.body.files = req.files
      .slice(0, opts.maxFiles)
      .map( ( media: IMedia ) => {
        const type = Pluralize(getTypeOfMedia(media.mimetype)) as string;
        media.owner = req.user.id;
        media.url = `${type}s/${type === 'image' ? `${SCALING.PATH_MASTER}/` : ''}${media.filename}`
        return media;
      }) || [];
    next();
  });
}

export { Upload }