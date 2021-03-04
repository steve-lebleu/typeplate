import { unlink } from 'fs';
import { EventEmitter } from 'events';
import { expectationFailed } from 'boom';
import { promisify } from 'es6-promisify';
import * as Jimp from 'jimp';

import { Media } from '@models/media.model';
import { IMedia } from '@interfaces/IMedia.interface';
import { jimp as JimpConfiguration } from '@config/environment.config';

const SIZES = Object.keys(JimpConfiguration).map(key => key);

const MEDIA_EVENT_EMITTER: EventEmitter = new EventEmitter();

MEDIA_EVENT_EMITTER.on('media.synchronized', (media: Media) => {
  const ulink = promisify(unlink) as (path: string) => Promise<void|Error>;
  if (!media.mimetype.includes('image')) { // TODO Change test
    void ulink(media.path.toString());
  } else {
    void Promise.all( [ulink(media.path.toString())].concat(SIZES.map(size => ulink(media.path.toString().replace('master-copy', `rescale/${size}`)) ) ) )
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
              .resize(JimpConfiguration[size], Jimp.AUTO)
              .write( `${media.destination.replace('master-copy', 'rescale')}/${size}/${media.filename}`, (err: Error) => {
                if(err) throw expectationFailed(err.message);
              });
          });
      })
      .catch();
  });
});

export { MEDIA_EVENT_EMITTER };