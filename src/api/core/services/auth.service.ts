import * as Dayjs from 'dayjs';

import { badData } from '@hapi/boom';

import { ACCESS_TOKEN } from '@config/environment.config';

import { UserRepository } from '@repositories/user.repository';
import { RefreshTokenRepository } from '@repositories/refresh-token.repository';

import { User } from '@models/user.model';
import { RefreshToken } from '@models/refresh-token.model';

import { IOauthResponse } from '@interfaces';

import { hash } from '@utils/string.util';
import { Database } from '@config/database.config';

/**
 * @description
 */
class AuthService {

  /**
   * @description
   */
  private static instance: AuthService;

  private constructor() {}

  /**
   * @description
   */
  static get(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * @description Build a token response and return it
   *
   * @param user
   * @param accessToken
   */
  async generateTokenResponse(user: User, accessToken: string): Promise<{ tokenType, accessToken, refreshToken, expiresIn }|Error> {
    if (!user || !(user instanceof User) || !user.id) {
      return badData('User is not an instance of User');
    }
    if (!accessToken) {
      return badData('Access token cannot be retrieved');
    }
    const tokenType = 'Bearer';
    const oldToken = await Database.dataSource.getRepository(RefreshToken).findOne({ where : { user: { id: user.id } } });
    if (oldToken) {
      await Database.dataSource.getRepository(RefreshToken).remove(oldToken)
    }
    const refreshToken = RefreshTokenRepository.generate(user).token;
    const expiresIn = Dayjs().add(ACCESS_TOKEN.DURATION, 'minutes');
    return { tokenType, accessToken, refreshToken, expiresIn };
  }

  /**
   * @description Revoke a refresh token
   *
   * @param user
   */
  async revokeRefreshToken(user: User): Promise<void|Error> {

    if (!user || !(user instanceof User) || !user.id) {
      return badData('User is not an instance of User');
    }

    const oldToken = await Database.dataSource.getRepository(RefreshToken).findOne({ where : { user: { id: user.id } } });

    if (oldToken) {
      await Database.dataSource.getRepository(RefreshToken).remove(oldToken)
    }
  }

  /**
   * @description Authentication by oAuth processing
   *
   * @param token Access token of provider
   * @param refreshToken Refresh token of provider
   * @param profile Shared profile information
   * @param next Callback function
   *
   * @async
   */
  async oAuth(token: string, refreshToken: string, profile: IOauthResponse, next: (e?: Error, v?: User|boolean) => void): Promise<void> {
    try {
      const email = profile.emails ? profile.emails.filter(mail => ( mail.hasOwnProperty('verified') && mail.verified ) || !mail.hasOwnProperty('verified') ).slice().shift().value : `${profile.name.givenName.toLowerCase()}${profile.name.familyName.toLowerCase()}@externalprovider.com`;
      const iRegistrable = {
        id: profile.id,
        username: profile.username ? profile.username : `${profile.name.givenName.toLowerCase()}${profile.name.familyName.toLowerCase()}`,
        email,
        picture: profile.photos.slice().shift()?.value,
        password: hash(email, 16)
      }
      const user = await UserRepository.oAuthLogin(iRegistrable) as User;
      return next(null, user);
    } catch (err) {
      return next(err, false);
    }
  }

  /**
   * @description Authentication by JWT middleware function
   *
   * @async
   */
  async jwt(payload: { sub }, next: (e?: Error, v?: User|boolean) => void): Promise<void> {
    try {
      const userRepository = Database.dataSource.getRepository(User);
      const user = await userRepository.findOne( payload.sub ) as User;
      if (user) {
        return next(null, user);
      }
      return next(null, false);
    } catch (err) {
      return next(err, false);
    }
  }
}

const authService = AuthService.get();

export { authService as AuthService }