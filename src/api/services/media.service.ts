import * as Jimp from 'jimp';

import { unlink, existsSync } from 'fs';
import { promisify } from 'es6-promisify';
import { expectationFailed } from '@hapi/boom';

import { Media } from '@models/media.model';
import { SCALING } from '@config/environment.config';
import { IMAGE_MIME_TYPE } from '@enums';

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
  private readonly SIZES = Object.keys(SCALING.SIZES).map(key => key.toLowerCase());

  private constructor() {}

  /**
   * @description
   */
  static get(): MediaService {
    if (!MediaService.instance) {
      MediaService.instance = new MediaService();
    }
    return MediaService.instance;
  }

  /**
   * @description
   *
   * @param media
   */
  rescale(media: Media): void|boolean {
    if (!SCALING.IS_ACTIVE) {
      return false;
    }
    void Jimp.read(media.path)
      .then( (image) => {
        this.SIZES
          .forEach( size => {
            image
              .clone()
              .resize(SCALING.SIZES[size.toUpperCase()], Jimp.AUTO)
              .write(`${media.path.split('/').slice(0, -1).join('/').replace(SCALING.PATH_MASTER, SCALING.PATH_SCALE)}/${size}/${media.filename as string}`, (err: Error) => {
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
        .map( size => media.path.toString().replace(SCALING.PATH_MASTER, `${SCALING.PATH_SCALE}/${size}`) )
        .filter( path => existsSync(path) )
        .map( path => ulink(path) );
      void Promise.all( [ existsSync(media.path.toString()) ? ulink( media.path.toString() ) : Promise.resolve() ].concat( promises ) );
    }
  }

}

const mediaService = MediaService.get();

export { mediaService as MediaService }