import { jwtSecret, facebookOauth, googleOauth } from '@config/environment.config';

import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

import { AuthService } from '@services/auth.service';

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
      case 'bearer':
        return new BearerStrategy( AuthService.bearer ) as unknown;
      case 'jwt':
        return new JwtStrategy( PassportConfiguration.options.jwt, AuthService.jwt ) as unknown;
      case 'facebook':
        return new FacebookStrategy({
          clientID: facebookOauth.id,
          clientSecret: facebookOauth.secret,
          callbackURL: facebookOauth.callback,
          profileFields: ['id', 'link', 'email', 'name', 'picture', 'address']
        }, AuthService.oAuth ) as unknown;
      case 'google':
        return new GoogleStrategy({
          clientID: googleOauth.id,
          clientSecret: googleOauth.secret,
          callbackURL: googleOauth.callback
        }, AuthService.oAuth ) as unknown;
    }
  }
}