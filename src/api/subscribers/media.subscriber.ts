require('module-alias/register');

import * as Jimp from 'jimp';
import * as Moment from 'moment-timezone';

import { unlink, existsSync } from 'fs';
import { promisify } from 'es6-promisify';

import { expectationFailed } from '@hapi/boom';
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent } from 'typeorm';

import { Media } from '@models/media.model';
import { resize } from '@config/environment.config';
import { IMAGE_MIME_TYPE } from '@enums/mime-type.enum';

const SIZES = Object.keys(resize.sizes).map(key => key);

const rescale = (media: Media) => {
  void Jimp.read(media.path)
    .then( (image) => {
      SIZES
        .forEach( size => {
          image
            .clone()
            .resize(resize.sizes[size], Jimp.AUTO)
            .write(`${media.path.split('/').slice(0, -1).join('/').replace(resize.destinations.master, resize.destinations.scale)}/${size}/${media.filename as string}`, (err: Error) => {
              if(err) throw expectationFailed(err.message);
            });
        });
    })
    .catch();
}

const remove = (media: Media) => {
  const ulink = promisify(unlink) as (path: string) => Promise<void|Error>;
  if ( !IMAGE_MIME_TYPE[media.mimetype] && existsSync(media.path.toString()) ) {
    void ulink(media.path.toString());
  } else {
    const promises = SIZES
      .map( size => media.path.toString().replace(resize.destinations.master, `${resize.destinations.scale}/${size}`) )
      .filter( path => existsSync(path) )
      .map( path => ulink(path) );
    void Promise.all( [ existsSync(media.path.toString()) ? ulink( media.path.toString() ) : Promise.resolve() ].concat( promises ) );
  }
};

/**
 * TODO Fallback when rollback commited
 */
@EventSubscriber()
export class MediaSubscriber implements EntitySubscriberInterface<Media> {

  previous: Media;

  /**
   * @description Indicates that this subscriber only listen to Media events.
   */
  listenTo(): any {
    return Media;
  }

  /**
   * @description Called after media deletetion.
   */
  beforeInsert(event: InsertEvent<Media>): void {
    event.entity.createdAt = Moment( new Date() ).utc(true).toDate();
  }

  /**
   * @description Called after media deletetion.
   */
  afterInsert(event: InsertEvent<Media>): void {
    if ( resize.isActive ) {
      rescale(event.entity);
    }
  }

  /**
   * @description Called after media deletetion.
   */
  beforeUpdate(event: UpdateEvent<Media>): void {
    event.entity.updatedAt = Moment( new Date() ).utc(true).toDate();
    this.previous = event.databaseEntity;
  }

  /**
   * @description Called after media deletetion.
   */
  afterUpdate(event: UpdateEvent<Media>): void {
    rescale(event.entity);
    remove(this.previous);
  }

  /**
   * @description Called after media deletetion.
   */
  afterRemove(event: RemoveEvent<Media>): void {
    remove(event.entity);
  }

}
