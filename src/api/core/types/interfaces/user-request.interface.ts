import { User } from '@models/user.model';
import { IRequest, IMedia } from '@interfaces';

/**
 * @description
 */
export interface IUserRequest extends IRequest {
  user?: any;
  logIn: (user: User, done: (err: any) => void) => void,
  files?: IMedia[],
  body: {
    token?: string,
    password?: string,
    passwordConfirmation?: string,
    passwordToRevoke?: string,
    isUpdatePassword: boolean
  }
  query: {
    email?: string,
    page?: string,
    perPage?: string
  }
}