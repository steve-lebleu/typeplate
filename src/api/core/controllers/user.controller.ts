import { getRepository, getCustomRepository } from 'typeorm';
import { forbidden } from '@hapi/boom';

import { User } from '@models/user.model';
import { UserRepository } from '@repositories/user.repository';
import { IUserRequest, IResponse } from '@interfaces';
import { Safe } from '@decorators/safe.decorator';
import { paginate } from '@utils/pagination.util';

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
  @Safe()
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
  @Safe()
  async loggedIn (req: IUserRequest, res: IResponse): Promise<void> {
    res.locals.data = new User(req.user);
  }

  /**
   * @description Creates and save new user
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @Safe()
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
  @Safe()
  async update (req: IUserRequest, res: IResponse): Promise<void> {
    const repository = getRepository(User);
    const user = await repository.findOneOrFail(req.params.userId);
    if (req.body.password && req.body.isUpdatePassword) {
      const pwdMatch = await user.passwordMatches(req.body.passwordToRevoke);
      if (!pwdMatch) {
        throw forbidden('Password to revoke does not match');
      }
    }
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
  @Safe()
  async list (req: IUserRequest, res: IResponse): Promise<void> {
    const repository = getCustomRepository(UserRepository);
    const response = await repository.list(req.query);
    res.locals.data = response.result;
    res.locals.meta = {
      total: response.total,
      pagination: paginate( parseInt(req.query.page, 10), parseInt(req.query.perPage, 10), response.total )
    }
  }

  /**
   * @description Delete user
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @Safe()
  async remove (req: IUserRequest, res: IResponse): Promise<void> {
    const repository = getRepository(User);
    const user = await repository.findOneOrFail(req.params.userId);
    void repository.remove(user);
  }
}

const userController = UserController.get();

export { userController as UserController }