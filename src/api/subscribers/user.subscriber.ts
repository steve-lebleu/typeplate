require('module-alias/register');

import * as Moment from 'moment-timezone';
import { EventSubscriber, EntitySubscriberInterface, UpdateEvent } from 'typeorm';
import { User } from '@models/user.model';
import { encrypt } from '@utils/string.util';

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
   * @description Called after media deletetion.
   */
  beforeInsert(event: UpdateEvent<User>): void {
    event.entity.apikey = encrypt(event.entity.email);
    event.entity.createdAt = Moment( new Date() ).utc(true).toDate();
  }

  /**
   * @description Called after media deletetion.
   */
  beforeUpdate(event: UpdateEvent<User>): void {
    event.entity.apikey = encrypt(event.entity.email)
    event.entity.updatedAt = Moment( new Date() ).utc(true).toDate();
  }

}
