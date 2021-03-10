import * as Moment from 'moment-timezone';

import { getCustomRepository, getRepository } from 'typeorm';

import { jwtExpirationInterval } from '@config/environment.config';

import { UserRepository } from '@repositories/user.repository';
import { RefreshTokenRepository } from '@repositories/refresh-token.repository';

import { User } from '@models/user.model';
import { RefreshToken } from '@models/refresh-token.model';

import { AuthProvider } from '@services/auth-provider.service';

/**
 * @description Build a token response and return it
 *
 * @param user
 * @param accessToken
 */
const generateTokenResponse = async (user : User, accessToken : string): Promise<{ tokenType, accessToken, refreshToken, expiresIn }> => {
  const tokenType = 'Bearer';
  const oldToken = await getRepository(RefreshToken).findOne({ where : { user } });
  if (oldToken) {
    await getRepository(RefreshToken).remove(oldToken)
  }
  const refreshToken = getCustomRepository(RefreshTokenRepository).generate(user).token;
  const expiresIn = Moment().add(jwtExpirationInterval, 'minutes');
  return { tokenType, accessToken, refreshToken, expiresIn };
}

/**
 * @description Authentication by oAuth middleware function
 * @async
 */
const oAuth = (service: 'facebook' | 'google') => async (token, next: (e?: Error, v?: User) => void): Promise<void> => {
  try {
    const userRepository = getCustomRepository(UserRepository);
    const userData = await AuthProvider[service](token);
    const user = await userRepository.oAuthLogin(userData);
    next(null, user);
  } catch (err) {
    return next(err);
  }
}

/**
 * @description Authentication by JWT middleware function
 * @async
 *
 * FIXME: promise error is not managed
 */
const jwt = async (payload: { sub }, next: (e?: Error, v?: User|boolean) => void): Promise<void> => {
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

export { generateTokenResponse, oAuth, jwt };