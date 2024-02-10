import { Request } from 'express';
import { badRequest, notFound } from '@hapi/boom';

import * as Jwt from 'jwt-simple';

import { Database } from '@config/database.config';
import { ACCESS_TOKEN } from '@config/environment.config';
import { IResponse, IUserRequest, ITokenOptions } from '@interfaces';
import { User } from '@models/user.model';
import { RefreshToken } from '@models/refresh-token.model';
import { UserRepository } from '@repositories/user.repository';
import { AuthService } from '@services/auth.service';
import { Safe } from '@decorators/safe.decorator';
import { ROLE, STATUS } from '@enums';
import { EmailEmitter } from '@events';

/**
 * Manage incoming requests from api/{version}/auth
 */
class AuthController {

  /**
   * @description
   */
  private static instance: AuthController;

  private constructor() {}

  /**
   * @description
   */
  static get(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  /**
   * @description Creates and save new user
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @Safe()
  async register(req: Request, res: IResponse): Promise<void> {
    const repository = Database.dataSource.getRepository(User);
    const user = new User(req.body as Record<string,unknown>);
    const count = await repository.count();
    if (count === 0) {
      user.role = ROLE.admin;
    }
    await repository.insert(user);
    const token = await AuthService.generateTokenResponse(user, user.token());
    res.locals.data = { token, user };
  }

  /**
   * @description Login with an existing user or creates a new one if valid accessToken token
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @Safe()
  async login(req: Request, res: IResponse): Promise<void> {
    const { user, accessToken } = await UserRepository.findAndGenerateToken(req.body as ITokenOptions);
    const token = await AuthService.generateTokenResponse(user as User, accessToken as string);
    res.locals.data = { token, user };
  }

  /**
   * @description Logout user
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @Safe()
  async logout(req: IUserRequest, res: IResponse): Promise<void> {
    await AuthService.revokeRefreshToken(req.user as User);
    res.locals.data = null;
  }

  /**
   * @description Login with an existing user or creates a new one if valid accessToken token
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @Safe()
  async oAuth (req: IUserRequest, res: IResponse): Promise<void> {
    const user = req.user as User;
    const accessToken = user.token();
    const token = await AuthService.generateTokenResponse(user, accessToken);
    res.locals.data = { token, user };
  }

  /**
   * @description Refresh JWT access token by RefreshToken removing, and re-creating
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @Safe()
  async refresh(req: Request, res: IResponse, next: (e?: Error) => void): Promise<void> {
    const refreshTokenRepository = Database.dataSource.getRepository(RefreshToken);

    const { token } = req.body as { token: { refreshToken?: string } };

    const refreshToken = await refreshTokenRepository.findOne({
      where : { token: token.refreshToken }
    });

    if(typeof(refreshToken) === 'undefined') {
      return next( notFound('RefreshToken not found') );
    }

    await refreshTokenRepository.remove(refreshToken);

    // Get owner user of the token
    const { user, accessToken } = await UserRepository.findAndGenerateToken({ email: refreshToken.user.email , refreshToken });
    const response = await AuthService.generateTokenResponse(user as User, accessToken as string);

    res.locals.data = { token: response };
  }

  /**
   * @description Confirm email address of a registered user
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   *
   * @fixme token should be temp: 24h
   */
   @Safe()
   async confirm (req: IUserRequest, res: IResponse): Promise<void> {

    const repository = Database.dataSource.getRepository(User);

    const decoded = Jwt.decode(req.body.token, ACCESS_TOKEN.SECRET) as { sub };
    if (!decoded) {
      throw badRequest('User token cannot be read');
    }

    const user = await repository.findOneOrFail(decoded.sub) as User;

    if ( user.status !== STATUS.REGISTERED && user.status !== STATUS.REVIEWED ) {
      throw badRequest('User status cannot be confirmed');
    }

    user.status = STATUS.CONFIRMED;

    await repository.save(user);

    const token = await AuthService.generateTokenResponse(user, user.token());
    res.locals.data = { token, user };
   }

  /**
   * @description Request a temporary token to change password
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
   @Safe()
   async requestPassword (req: IUserRequest, res: IResponse): Promise<void> {

    const repository = Database.dataSource.getRepository(User);

    const user = await repository.findOne( { where: { email: req.query.email } }) as User;

    if ( user && user.status === STATUS.CONFIRMED ) {
      void AuthService.revokeRefreshToken(user);
      EmailEmitter.emit('password.request', user);
    }

    res.locals.data = {};
   }
}

const authController = AuthController.get();

export { authController as AuthController }