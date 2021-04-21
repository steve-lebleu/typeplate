require('module-alias/register');

import * as Dayjs from 'dayjs';
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent } from 'typeorm';
import { User } from '@models/user.model';
import { encrypt } from '@utils/string.util';
import { CacheService } from '@services/cache.service';
import { STATUS } from '@enums';
import { EmailEmitter } from '@events';

/**
 *
 */
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {

  previous: User;

  /**
   * @description Indicates that this subscriber only listen to Media events.
   */
  listenTo(): any {
    return User;
  }

  /**
   * @description Called before user insertion.
   */
  beforeInsert(event: InsertEvent<User>): void {
    event.entity.apikey = !event.entity.apikey ? encrypt(event.entity.email) : event.entity.apikey;
    event.entity.status = STATUS.REGISTERED;
    event.entity.createdAt = Dayjs( new Date() ).toDate();
  }

  /**
   * @description Called after media insertion.
   */
  afterInsert(event: InsertEvent<User>): void {
    CacheService.refresh('users');
    EmailEmitter.emit('user.confirm', event.entity);
  }

  /**
   * @description Called before user update.
   */
  beforeUpdate(event: UpdateEvent<User>): void {
    event.entity.apikey = encrypt(event.entity.email)
    event.entity.updatedAt = Dayjs( new Date() ).toDate();
    if (event.entity.email !== event.databaseEntity.email) {
      event.entity.status = STATUS.REVIEWED;
    }
  }

  /**
   * @description Called after user update.
   */
  afterUpdate(event: UpdateEvent<User>): void {
    CacheService.refresh('users');
    if (event.entity.status === STATUS.CONFIRMED && event.databaseEntity.status === STATUS.REGISTERED) {
      EmailEmitter.emit('user.welcome', event.databaseEntity);
    }
    if (event.entity.email !== event.databaseEntity.email) {
      EmailEmitter.emit('user.confirm', event.entity);
    }
  }

  /**
   * @description Called after user deletetion.
   */
  afterRemove(event: RemoveEvent<User>): void {
    CacheService.refresh('users');
  }

}
