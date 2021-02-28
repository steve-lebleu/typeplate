import { Request, Response } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import { CREATED } from 'http-status';
import { notFound } from 'boom';

import { Controller } from '@bases/controller.class';
import { User } from '@models/user.model';
import { RefreshToken } from '@models/refresh-token.model';
import { UserRepository } from '@repositories/user.repository';
import { checkMySQLError } from '@utils/error.util';
import { generateTokenResponse } from '@utils/auth.util';

/**
 * Manage incoming requests from api/{version}/auth
 */
export class AuthController extends Controller {

  constructor() {
    super();
  }

  /**
   * @description Creates and save new user
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  async register(req: Request, res : Response, next: Function ): Promise<void> {
    try {
      const repository = getRepository(User);
      const user = new User(req.body);
      await repository.insert(user);
      const token = await generateTokenResponse(user, user.token());
      res.status(CREATED);
      res.locals.data = { token, user: user.whitelist() };
      next();
    } catch (e) {
      next( checkMySQLError(e) );
    }
  }

  /**
   * @description Login with an existing user or creates a new one if valid accessToken token
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  async login(req: Request, res : Response, next: Function) {
    try {
      const repository = getCustomRepository(UserRepository);
      const { user, accessToken } = await repository.findAndGenerateToken(req.body, req.headers.from);
      const token = await generateTokenResponse(user, accessToken);
      res.locals.data = { token, user: user.whitelist() };
      next();
    } catch (e) {
      next( checkMySQLError(e) );
    }
  }

  /**
   * @description Login with an existing user or creates a new one if valid accessToken token
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  async oAuth (req: Request, res : Response, next: Function) {
    try {
      const user = req.body;
      const accessToken = user.token();
      const token = generateTokenResponse(user, accessToken);
      res.locals.data = { token, user: user.whitelist() };
      next();
    } catch (e) {
      next( checkMySQLError(e) );
    }
  }

  /**
   * @description Login with an existing user or creates a new one if valid accessToken token
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  async authorize (req: Request, res : Response, next: Function) {
    try {
      const user = req.body;
      const accessToken = user.token();
      const token = generateTokenResponse(user, accessToken);
      res.locals.data = { token, user: user.whitelist() };
      next();
    } catch (e) {
      next( checkMySQLError(e) );
    }
  }

  /**
   * @description Refresh JWT token by RefreshToken removing, and re-creating
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  async refresh(req: Request, res : Response, next: Function) {

    try {

      const refreshTokenRepository = getRepository(RefreshToken);
      const userRepository = getCustomRepository(UserRepository);

      const { token } = req.body;

      const refreshObject = await refreshTokenRepository.findOne({
        where : { token: token.refreshToken }
      });

      if(typeof(refreshObject) === 'undefined') {
        return next( notFound('RefreshObject not found') );
      }

      await refreshTokenRepository.remove(refreshObject);

      // Get owner user of the token
      const { user, accessToken } = await userRepository.findAndGenerateToken({ email: refreshObject.user.email , refreshObject });
      const response = await generateTokenResponse(user, accessToken);

      res.locals.data = { token: response };

      next();

    } catch (e) {
      next( checkMySQLError( e ) );
    }
  }
}