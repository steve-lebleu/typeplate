import { jwtSecret } from '@config/environment.config';

import * as BearerStrategy from 'passport-http-bearer';

import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';

import { oAuth, jwt } from '@services/auth.service';

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
        return new JwtStrategy( PassportConfiguration.options.jwt, jwt );
      case 'facebook':
        return new BearerStrategy( oAuth('facebook') );
      case 'google':
        return new BearerStrategy( oAuth('google') );
    }
  }
}