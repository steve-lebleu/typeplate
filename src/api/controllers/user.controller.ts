import * as Moment from 'moment'

import { getRepository, getCustomRepository } from 'typeorm';
import { CREATED, NO_CONTENT } from 'http-status';

import { User } from '@models/user.model';
import { UserRepository } from '@repositories/user.repository';
import { IUserRequest } from '@interfaces/IUserRequest.interface';
import { IResponse } from '@interfaces/IResponse.interface';
import { safe } from '@decorators/safe.decorator';

/**
 * Manage incoming requests for api/{version}/users
 */
export class UserController {

  constructor() {}

  /**
   * @description Get user
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @safe
  static async get(req: IUserRequest, res: IResponse): Promise<void> {
    const repository = getCustomRepository(UserRepository);
    res.locals.data = await repository.one(req.params.userId);
  }

  /**
   * @description Get logged in user info
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @safe
  static async loggedIn (req: IUserRequest, res: IResponse): Promise<void> {
    res.locals.data = new User(req.user);
  }

  /**
   * @description Creates and save new user
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @safe
  static async create (req: IUserRequest, res: IResponse): Promise<void> {
    const repository = getRepository(User);
    const user = new User(req.body);
    const savedUser = await repository.save(user);
    res.status( CREATED );
    res.locals.data = savedUser;
  }

  /**
   * @description Update existing user
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @safe
  static async update (req: IUserRequest, res: IResponse): Promise<void> {
    const repository = getRepository(User);
    const user = await repository.findOneOrFail(req.params.userId);
    user.updatedAt = Moment( new Date() ).format('YYYY-MM-DD HH:ss');
    repository.merge(user, req.body);
    await repository.save(user);
    res.locals.data = user;
  }

  /**
   * @description Get user list
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @safe
  static async list (req: IUserRequest, res: IResponse): Promise<void> {
    const repository = getCustomRepository(UserRepository);
    const users = await repository.list(req.query);
    res.locals.data = users;
  }

  /**
   * @description Delete user
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @safe
  static async remove (req: IUserRequest, res: IResponse): Promise<void> {
    const repository = getRepository(User);
    const user = await repository.findOneOrFail(req.params.userId);
    await repository.remove(user);
    res.status(NO_CONTENT);
  }
}
