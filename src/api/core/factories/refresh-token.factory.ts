import * as Dayjs from 'dayjs';

import { randomBytes } from 'crypto';
import { User } from '@models/user.model';
import { RefreshToken } from '@models/refresh-token.model';
import { REFRESH_TOKEN } from '@config/environment.config';

/**
 * @description
 */
export class RefreshTokenFactory {

  /**
   * @description
   *
   * @param user
   */
  static get(user: User): RefreshToken {
    const token = `${user.id}.${randomBytes(40).toString('hex')}`;
    const expires = Dayjs().add(REFRESH_TOKEN.DURATION, REFRESH_TOKEN.UNIT).toDate();
    return new RefreshToken( token, user, expires );
  }
}