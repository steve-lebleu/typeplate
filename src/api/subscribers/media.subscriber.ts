require('module-alias/register');

import * as Moment from 'moment-timezone';

import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent } from 'typeorm';

import { Media } from '@models/media.model';
import { SCALING } from '@config/environment.config';
import { rescale, remove } from '@services/media.service';

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
    if ( SCALING.IS_ACTIVE ) {
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
