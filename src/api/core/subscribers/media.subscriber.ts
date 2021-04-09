require('module-alias/register');

import * as Dayjs from 'dayjs';

import { CacheService } from '@services/cache.service';

import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent } from 'typeorm';

import { Media } from '@models/media.model';
import { MediaService } from '@services/media.service';

@EventSubscriber()
export class MediaSubscriber implements EntitySubscriberInterface<Media> {

  /**
   * @description Indicates that this subscriber only listen to Media events.
   */
  listenTo(): any {
    return Media;
  }

  /**
   * @description Called before media insertion.
   */
  beforeInsert(event: InsertEvent<Media>): void {
    event.entity.createdAt = Dayjs( new Date() ).toDate();
  }

  /**
   * @description Called after media insertion.
   */
  afterInsert(event: InsertEvent<Media>): void {
    MediaService.rescale(event.entity);
    CacheService.refresh('medias');
  }

  /**
   * @description Called before media update.
   */
  beforeUpdate(event: UpdateEvent<Media>): void {
    event.entity.updatedAt = Dayjs( new Date() ).toDate();
  }

  /**
   * @description Called after media update.
   */
  afterUpdate(event: UpdateEvent<Media>): void {
    MediaService.rescale(event.entity);
    MediaService.remove(event.databaseEntity);
    CacheService.refresh('medias');
  }

  /**
   * @description Called after media deletetion.
   */
  afterRemove(event: RemoveEvent<Media>): void {
    MediaService.remove(event.entity);
    CacheService.refresh('medias');
  }

}
