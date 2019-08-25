import { jwtSecret } from "@config/environment.config";

import * as BearerStrategy from "passport-http-bearer";

import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { getCustomRepository, getRepository } from "typeorm";

import { Container } from "@config/container.config";

import { UserRepository } from "@repositories/user.repository";
import { User } from "@models/user.model";

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
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer')
    }
  };
  
  constructor() {}

  /**
   * @description Authentication by oAuth middleware function
   * @async
   */
  private static oAuth = service => async (token, next: Function) => {
    try {
      const userRepository = getCustomRepository(UserRepository);
      const userData = await Container.resolve('AuthProvider')[service](token);
      const user = await userRepository.oAuthLogin(userData);
      next(null, user);
    } catch (err) { return next(err); }
  }

  /**
   * @description Authentication by JWT middleware function
   * @async
   */
  private static jwt = async (payload, next: Function) => {
    try {
      const userRepository = getRepository(User);
      const user = await userRepository.findOne( payload.sub );
      if (user) {
        return next(null, user);
      }
      return next(null, false);
    } catch (error) { return next(error, false); }
  }

  /**
   * @description Provide a passport strategy instance
   * 
   * @param {string} strategy Strategy to instanciate
   */
  static factory (strategy: string): any {
    let instance;
    switch(strategy) {
      case 'jwt': 
        instance = new JwtStrategy(this.options.jwt, this.jwt);
      break;
      case 'facebook': 
        instance = new BearerStrategy(this.oAuth('facebook'));
      break;
      case 'google': 
        instance = new BearerStrategy(this.oAuth('google'));
      break;
    }
    return instance;
  }

}