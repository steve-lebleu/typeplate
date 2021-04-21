import * as Jimp from 'jimp';

import { unlink, existsSync } from 'fs';
import { promisify } from 'es6-promisify';
import { expectationFailed } from '@hapi/boom';

import { SCALING } from '@config/environment.config';

import { Media } from '@models/media.model';
import { IMAGE_MIME_TYPE } from '@enums';
import { EnvImageScaling } from '@types'

/**
 * @description
 */
class MediaService {

  /**
   * @description
   */
  private static instance: MediaService;

  /**
   * @description
   */
  private readonly OPTIONS: EnvImageScaling;

  /**
   * @description
   */
  private readonly SIZES: string[];

  private constructor(config: EnvImageScaling) {
    this.OPTIONS = config;
    this.SIZES = Object.keys(this.OPTIONS.SIZES).map(key => key.toLowerCase())
  }

  /**
   * @description
   */
  static get(config: any): MediaService {
    if (!MediaService.instance) {
      MediaService.instance = new MediaService(config);
    }
    return MediaService.instance;
  }

  /**
   * @description
   *
   * @param media
   */
  rescale(media: Media): void|boolean {
    if (!this.OPTIONS.IS_ACTIVE) {
      return false;
    }
    void Jimp.read(media.path)
      .then( (image) => {
        this.SIZES
          .forEach( size => {
            image
              .clone()
              .resize(this.OPTIONS.SIZES[size.toUpperCase()], Jimp.AUTO)
              .write(`${media.path.split('/').slice(0, -1).join('/').replace(this.OPTIONS.PATH_MASTER, this.OPTIONS.PATH_SCALE)}/${size}/${media.filename as string}`, (err: Error) => {
                if(err) throw expectationFailed(err.message);
              });
          });
      })
      .catch();
  }

  /**
   * @description
   *
   * @param media
   */
  remove (media: Media): void {
    const ulink = promisify(unlink) as (path: string) => Promise<void|Error>;
    if ( !IMAGE_MIME_TYPE[media.mimetype] && existsSync(media.path.toString()) ) {
      void ulink(media.path.toString());
    } else {
      const promises = this.SIZES
        .map( size => media.path.toString().replace(`${this.OPTIONS.PATH_MASTER}/${media.fieldname}`, `${this.OPTIONS.PATH_SCALE}/${media.fieldname}/${size}`) )
        .filter( path => existsSync(path) )
        .map( path => ulink(path) );
      void Promise.all( [ existsSync(media.path.toString()) ? ulink( media.path.toString() ) : Promise.resolve() ].concat( promises ) );
    }
  }

}

const mediaService = MediaService.get(SCALING);

export { mediaService as MediaService }