import { getRepository, getCustomRepository } from 'typeorm';

import { User } from '@models/user.model';
import { UserRepository } from '@repositories/user.repository';
import { IUserRequest, IResponse } from '@interfaces';
import { safe } from '@decorators/safe.decorator';

/**
 * Manage incoming requests for api/{version}/users
 */
class UserController {

  /**
   * @description
   */
   private static instance: UserController;

   private constructor() {}

    /**
     * @description
     */
  static get(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  /**
   * @description Get user
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @safe
  async get(req: IUserRequest, res: IResponse): Promise<void> {
    const repository = getCustomRepository(UserRepository);
    res.locals.data = await repository.one(parseInt(req.params.userId, 10));
  }

  /**
   * @description Get logged in user info
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @safe
  async loggedIn (req: IUserRequest, res: IResponse): Promise<void> {
    res.locals.data = new User(req.user);
  }

  /**
   * @description Creates and save new user
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @safe
  async create (req: IUserRequest, res: IResponse): Promise<void> {
    const repository = getRepository(User);
    const user = new User(req.body);
    const savedUser = await repository.save(user);
    res.locals.data = savedUser;
  }

  /**
   * @description Update existing user
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @safe
  async update (req: IUserRequest, res: IResponse): Promise<void> {
    const repository = getRepository(User);
    const user = await repository.findOneOrFail(req.params.userId);
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
  async list (req: IUserRequest, res: IResponse): Promise<void> {
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
  async remove (req: IUserRequest, res: IResponse): Promise<void> {
    const repository = getRepository(User);
    const user = await repository.findOneOrFail(req.params.userId);
    void repository.remove(user);
  }
}

const userController = UserController.get();

export { userController as UserController }