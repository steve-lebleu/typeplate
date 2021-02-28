import * as Multer from 'multer';
import * as Pluralize from 'pluralize';
import * as filenamify from 'filenamify';

import { unsupportedMediaType, expectationFailed, entityTooLarge } from 'boom';
import { IUpload } from '@interfaces/IUpload.interface';
import { upload } from '@config/environment.config';
import { filename, extension, fieldname } from '@utils/string.util';
import { IMAGE_MIME_TYPE } from '@enums/mime-type.enum';

/**
 * Set Multer default configuration.
 *
 * @see https://www.npmjs.com/package/multer
 */
export class MulterConfiguration {

  /**
   * @description Wrapped Multer instance
   */
  multer = Multer;

  /**
   * @description Default options
   */
  options: IUpload = {
    destination: upload.path,
    filesize: upload.maxFileSize, // 1000000 bytes = 0,95367 Mo
    wildcards: upload.wildcards,
    maxFiles: upload.maxFiles
  };

  constructor() {}

  /**
   * @description Set storage config
   * @param destination As main destination
   */
  storage(destination?: string) {
    return this.multer.diskStorage({
      destination (req: Request, file, next: Function) {
        let towards = destination + '/' + Pluralize(fieldname(file.mimetype));
        if (typeof IMAGE_MIME_TYPE[file.mimetype] !== 'undefined') {
          towards += '/master-copy';
        }
        next(null, towards);
      },
      filename (req: Request, file, next: Function) {
        const name = filenamify( filename(file.originalname), { replacement: '-', maxLength: 123 } )
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
  get( options?: IUpload ) {
    const authorized = options ? options.wildcards : this.options.wildcards;
    return {
      storage : this.storage(  options ? options.destination : this.options.destination ),
      limits : {
        fileSize: options ? options.filesize : this.options.filesize
      },
      fileFilter(req: Request, file, next: Function) {
        try {
          // Mime-type
          if(authorized.filter( mime => file.mimetype === mime ).length === 0) {
            return next( unsupportedMediaType('File mimetype not supported'), false );
          }
          // Size
          if (file.size > upload.maxFileSize) {
            return next( entityTooLarge('File too large : max file size is ' + upload.maxFileSize + 'ko'), false );
          }
          return next(null, true);
        } catch(e) {
 next( expectationFailed(e.message) );
}
      }
    };
  }

}