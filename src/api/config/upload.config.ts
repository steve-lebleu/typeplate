import * as Multer from 'multer';
import * as filenamify from 'filenamify';
import { existsSync, mkdirSync } from 'fs';
import { unsupportedMediaType } from '@hapi/boom';

import { UPLOAD, SCALING } from '@config/environment.config';

import { IUploadMulterOptions, IUploadOptions, IMedia, IStorage, IUpload } from '@interfaces';

import { foldername, extension, getTypeOfMedia } from '@utils/string.util';
import { FIELDNAME, IMAGE_MIME_TYPE } from '@enums';
import { list } from '@utils/enum.util';

class UploadConfiguration {

  private static instance: UploadConfiguration;

  /**
   * @description Default options
   */
  options: IUploadOptions = {
    destination: UPLOAD.PATH,
    maxFiles: UPLOAD.MAX_FILES,
    filesize: UPLOAD.MAX_FILE_SIZE,
    wildcards: UPLOAD.WILDCARDS
  };

  /**
   * @description
   */
  engine = Multer as (options?) => IUpload;

  private constructor() { }

  /**
   * @description
   */
  static get(): UploadConfiguration {
    if (!UploadConfiguration.instance) {
      UploadConfiguration.instance = new UploadConfiguration();
    }
    return UploadConfiguration.instance;
  }

  /**
   * @description Set Multer instance
   *
   * @param destination Directory where file will be uploaded
   * @param filesize Max file size authorized
   * @param wildcards Array of accepted mime types
   */
  configuration( options?: IUploadOptions ): IUploadMulterOptions {
    return {
      storage: this.storage(options.destination),
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
  private storage(destination?: string): IStorage {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return Multer.diskStorage({
      destination: (req: Request, file: IMedia, next: (e?: Error, v?: any) => void) => {
        let towards = `${destination}/${getTypeOfMedia(file.mimetype)}s`;
        if (IMAGE_MIME_TYPE[file.mimetype]) {
          towards += `/${SCALING.PATH_MASTER}`;
        }
        towards += `/${file.fieldname}`;
        if ( list(FIELDNAME).includes(file.fieldname) && !existsSync(towards) ) {
          mkdirSync(towards);
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

const configuration = UploadConfiguration.get();

export { configuration as UploadConfiguration }