import * as Moment from 'moment-timezone';

import { randomBytes } from 'crypto';
import { User } from '@models/user.model';
import { RefreshToken } from '@models/refresh-token.model';
import { refresh } from '@config/environment.config';

export class RefreshTokenFactory {

  constructor() {}

  /**
   * @description
   *
   * @param user
   */
  static get(user: User): RefreshToken {
    const token = `${user.id}.${randomBytes(40).toString('hex')}`;
    const expires = Moment().add(refresh.duration, refresh.unit).toDate();
    return new RefreshToken( token, user, expires );
  }
}