import { Request } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import { notFound } from '@hapi/boom';

import { IResponse } from '@interfaces/IResponse.interface';
import { User } from '@models/user.model';
import { RefreshToken } from '@models/refresh-token.model';
import { UserRepository } from '@repositories/user.repository';
import { AuthService } from '@services/auth.service';
import { safe } from '@decorators/safe.decorator';
import { IUserRequest } from '@interfaces/IUserRequest.interface';

/**
 * Manage incoming requests from api/{version}/auth
 */
export class AuthController {

  constructor() {}

  /**
   * @description Creates and save new user
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @safe
  static async register(req: Request, res: IResponse): Promise<void> {
    const repository = getRepository(User);
    const user = new User(req.body);
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
  @safe
  static async login(req: Request, res: IResponse): Promise<void> {
    const repository = getCustomRepository(UserRepository);
    const { user, accessToken } = await repository.findAndGenerateToken(req.body);
    const token = await AuthService.generateTokenResponse(user, accessToken);
    res.locals.data = { token, user };
  }

  /**
   * @description Login with an existing user or creates a new one if valid accessToken token
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @safe
  static async oAuth (req: IUserRequest, res: IResponse): Promise<void> {
    const user = req.user as User;
    const accessToken = user.token();
    const token = await AuthService.generateTokenResponse(user, accessToken);
    res.locals.data = { token, user };
  }

  /**
   * @description Login with an existing user or creates a new one if valid accessToken token
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @safe
  static async authorize (req: Request, res: IResponse): Promise<void> {
    const user = req.body as User;
    const accessToken = user.token();
    const token = await AuthService.generateTokenResponse(user, accessToken);
    res.locals.data = { token, user };
  }

  /**
   * @description Refresh JWT token by RefreshToken removing, and re-creating
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @safe
  static async refresh(req: Request, res: IResponse, next: (e?: Error) => void): Promise<void> {
    const refreshTokenRepository = getRepository(RefreshToken);
    const userRepository = getCustomRepository(UserRepository);

    const { token } = req.body as { token: { refreshToken?: string } };

    const refreshToken = await refreshTokenRepository.findOne({
      where : { token: token.refreshToken }
    });

    if(typeof(refreshToken) === 'undefined') {
      return next( notFound('RefreshToken not found') );
    }

    await refreshTokenRepository.remove(refreshToken);

    // Get owner user of the token
    const { user, accessToken } = await userRepository.findAndGenerateToken({ email: refreshToken.user.email , refreshToken });
    const response = await AuthService.generateTokenResponse(user, accessToken);

    res.locals.data = { token: response };
  }
}