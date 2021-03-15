import * as Moment from 'moment-timezone';

import { getCustomRepository, getRepository } from 'typeorm';

import { JWT } from '@config/environment.config';

import { UserRepository } from '@repositories/user.repository';
import { RefreshTokenRepository } from '@repositories/refresh-token.repository';

import { User } from '@models/user.model';
import { RefreshToken } from '@models/refresh-token.model';

import { badData } from '@hapi/boom';
import { IOauthResponse } from '@interfaces/IOauthResponse.interface';

import { hash } from '@utils/string.util';

export class AuthService {

  /**
   * @description Build a token response and return it
   *
   * @param user
   * @param accessToken
   */
  static async generateTokenResponse(user: User, accessToken: string): Promise<{ tokenType, accessToken, refreshToken, expiresIn }|Error> {
    if (!user || !(user instanceof User)) {
      return badData('User is not an instance of User');
    }
    try {
      const tokenType = 'Bearer';
      const oldToken = await getRepository(RefreshToken).findOne({ where : { user } });
      if (oldToken) {
        await getRepository(RefreshToken).remove(oldToken)
      }
      const refreshToken = getCustomRepository(RefreshTokenRepository).generate(user).token;
      const expiresIn = Moment().add(JWT.EXPIRATION, 'minutes');
      return { tokenType, accessToken, refreshToken, expiresIn };
    } catch(e) {
      return e;
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
  static async oAuth(token: string, refreshToken: string, profile: IOauthResponse, next: (e?: Error, v?: User|boolean) => void): Promise<void> {
    try {
      const iRegistrable = {
        id: profile.id,
        username: profile.username ? profile.username : `${profile.name.givenName.toLowerCase()}${profile.name.familyName.toLowerCase()}`,
        email: profile.emails ? profile.emails.filter(email => (email.hasOwnProperty('verified') && email.verified) || email.value).slice().shift()?.value : `${profile.name.givenName.toLowerCase()}${profile.name.familyName.toLowerCase()}@externalprovider.com`,
        picture: profile.photos.slice().shift()?.value,
        password: hash('email', 16)
      }
      const userRepository = getCustomRepository(UserRepository);
      const user = await userRepository.oAuthLogin(iRegistrable);
      if (user) {
        return next(null, user);
      }
      return next(null, false);
    } catch (err) {
      return next(err, false);
    }
  }

  /**
   * @description Authentication by JWT middleware function
   *
   * @async
   */
  static async jwt(payload: { sub }, next: (e?: Error, v?: User|boolean) => void): Promise<void> {
    try {
      const userRepository = getRepository(User);
      const user = await userRepository.findOne( payload.sub );
      if (user) {
        return next(null, user);
      }
      return next(null, false);
    } catch (error) {
      return next(error, false);
    }
  }
}