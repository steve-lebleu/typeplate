import * as Moment from 'moment'

import { Request, Response } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import { CREATED, NO_CONTENT } from 'http-status';

import { Controller } from '@bases/controller.class';
import { User } from '@models/user.model';
import { UserRepository } from '@repositories/user.repository';
import { checkMySQLError } from '@utils/error.util';
import { IUserRequest } from '@interfaces/IUserRequest.interface';

/**
 * Manage incoming requests for api/{version}/users
 */
export class UserController extends Controller {

  constructor() {
 super();
}

  /**
   * @description Get user
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  async get(req: Request, res: Response, next: Function) {
    try {
      const repository = getCustomRepository(UserRepository);
      res.locals.data = await repository.one(req.params.userId);
      next();
    } catch (e) {
      next( checkMySQLError( e ) );
    }
  }

  /**
   * @description Get logged in user info
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  public loggedIn (req: IUserRequest, res : Response, next: Function) {
    try {
      res.locals.data = new User(req.user);
      next();
    } catch(e) {
      next(e);
    }
  }

  /**
   * @description Creates and save new user
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  async create (req: Request, res : Response, next: Function) {
    try {
      const repository = getRepository(User);
      const user = new User(req.body);
      const savedUser = await repository.save(user);
      res.status( CREATED );
      res.locals.data = savedUser;
      next();
    } catch (e) {
      next( checkMySQLError( e ) );
    }
  }

  /**
   * @description Update existing user
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  async update (req: Request, res : Response, next: Function) {
    try {
      const repository = getRepository(User);
      const user = await repository.findOneOrFail(req.params.userId);
      user.updatedAt = Moment( new Date() ).format('YYYY-MM-DD HH:ss');
      repository.merge(user, req.body);
      repository.save(user);
      res.locals.data = user;
      next();
    } catch(e) {
      next( checkMySQLError( e ) );
    }
  }

  /**
   * @description Get user list
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  async list (req: Request, res : Response, next: Function) {
    try {
      const repository = getCustomRepository(UserRepository);
      const users = await repository.list(req.query);
      res.locals.data = users;
      next();
    } catch (e) {
      next( checkMySQLError( e ) );
    }
  }

  /**
   * @description Delete user
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  async remove (req: Request, res : Response, next: Function) {
    try {
      const repository = getRepository(User);
      const user = await repository.findOneOrFail(req.params.userId);
      await repository.remove(user);
      res.status(NO_CONTENT);
      next();
    } catch(e) {
      next( checkMySQLError( e ) );
    }
  }
}
