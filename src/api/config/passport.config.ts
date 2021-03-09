import { jwtSecret } from '@config/environment.config';

import * as BearerStrategy from 'passport-http-bearer';

import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { getCustomRepository, getRepository } from 'typeorm';

import { AuthProvider } from '@services/auth-provider.service';
import { UserRepository } from '@repositories/user.repository';
import { User } from '@models/user.model';

const ExtractJwtAlias = ExtractJwt as { fromAuthHeaderWithScheme: (type: string) => string };

/**
 * Passport configuration
 */
export class PassportConfiguration {

  /**
   * @description Default options
   */
  private static options = {
    jwt: {
      secretOrKey: jwtSecret,
      jwtFromRequest: ExtractJwtAlias.fromAuthHeaderWithScheme('Bearer')
    }
  };

  constructor() {}

  /**
   * @description Provide a passport strategy instance
   *
   * @param strategy Strategy to instanciate
   */
  static factory (strategy: string): JwtStrategy|BearerStrategy {
    switch(strategy) {
      case 'jwt':
        return new JwtStrategy( PassportConfiguration.options.jwt, PassportConfiguration.jwt );
      case 'facebook':
        return new BearerStrategy( PassportConfiguration.oAuth('facebook') );
      case 'google':
        return new BearerStrategy( PassportConfiguration.oAuth('google') );
    }
  }

  /**
   * @description Authentication by oAuth middleware function
   * @async
   */
  private static oAuth = (service: 'facebook' | 'google') => async (token, next: (e?: Error, v?: User) => void) => {
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
   */
  private static jwt = async (payload: { sub }, next: (e?: Error, v?: User|boolean) => void) => {
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