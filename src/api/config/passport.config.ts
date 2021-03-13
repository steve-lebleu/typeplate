import { JWT, FACEBOOK, GOOGLE, GITHUB, LINKEDIN } from '@config/environment.config';

import { use } from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { Strategy as GithubStrategy } from 'passport-github2';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';

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
      secretOrKey: JWT.SECRET,
      jwtFromRequest: ExtractJwtAlias.fromAuthHeaderWithScheme('Bearer')
    }
  };

  constructor() {}

  /**
   * @description Provide a passport strategy instance
   *
   * @param strategy Strategy to instanciate
   */
  static factory (strategy: string): unknown {
    switch(strategy) {
      case 'jwt':
        return new JwtStrategy( PassportConfiguration.options.jwt, AuthService.jwt ) as unknown;
      case 'facebook':
        return new FacebookStrategy({
          clientID: FACEBOOK.ID,
          clientSecret: FACEBOOK.SECRET,
          callbackURL: FACEBOOK.CALLBACK_URL,
          profileFields: ['id', 'link', 'email', 'name', 'picture', 'address']
        }, AuthService.oAuth ) as unknown;
      case 'google':
        return new GoogleStrategy({
          clientID: GOOGLE.ID,
          clientSecret: GOOGLE.SECRET,
          callbackURL: GOOGLE.CALLBACK_URL,
          scope: ['profile', 'email']
        }, AuthService.oAuth ) as unknown;
      case 'github':
        return new GithubStrategy({
          clientID: GITHUB.ID,
          clientSecret: GITHUB.SECRET,
          callbackURL: GITHUB.CALLBACK_URL,
          scope: ['profile', 'email']
        }, AuthService.oAuth ) as unknown;
      case 'linkedin':
        return new LinkedInStrategy({
          clientID: LINKEDIN.ID,
          clientSecret: LINKEDIN.SECRET,
          callbackURL: LINKEDIN.CALLBACK_URL,
          scope: ['profile', 'email']
        }, AuthService.oAuth ) as unknown;
    }
  }

  /**
   * @description
   */
  static plug(): void {
    use(PassportConfiguration.factory('jwt'));
    [ FACEBOOK, GITHUB, GOOGLE, LINKEDIN ]
      .filter(provider => provider.IS_ACTIVE)
      .forEach(provider => {
        use(PassportConfiguration.factory(provider.KEY))
      });
  }

}