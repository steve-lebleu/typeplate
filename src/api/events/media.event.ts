import { unlink } from 'fs';
import { EventEmitter } from 'events';
import { expectationFailed } from '@hapi/boom';
import { promisify } from 'es6-promisify';
import * as Jimp from 'jimp';

import { Media } from '@models/media.model';
import { IMedia } from '@interfaces/IMedia.interface';
import { resize } from '@config/environment.config';

import { IMAGE_MIME_TYPE } from '@enums/mime-type.enum';

const SIZES = Object.keys(resize.sizes).map(key => key);

const MEDIA_EVENT_EMITTER: EventEmitter = new EventEmitter();

MEDIA_EVENT_EMITTER.on('media.synchronized', (media: Media) => {
  const ulink = promisify(unlink) as (path: string) => Promise<void|Error>;
  if (IMAGE_MIME_TYPE[media.mimetype]) {
    void ulink(media.path.toString());
  } else {
    void Promise.all( [ulink(media.path.toString())].concat(SIZES.map(size => ulink(media.path.toString().replace(resize.destinations.master, `${resize.destinations.scale}/${size}`)) ) ) )
  }
});

MEDIA_EVENT_EMITTER.on('media.resize', (medias: IMedia[]) => {
  medias.forEach( (media: IMedia) => {
    void Jimp.read(media.path)
      .then( (image) => {
        SIZES
          .forEach( size => {
            image
              .clone()
              .resize(resize.sizes[size], Jimp.AUTO)
              .write( `${media.destination.replace(resize.destinations.master, resize.destinations.scale)}/${size}/${media.filename}`, (err: Error) => {
                if(err) throw expectationFailed(err.message);
              });
          });
      })
      .catch();
  });
});

export { MEDIA_EVENT_EMITTER };