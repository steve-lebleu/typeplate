import { User } from '@models/user.model';
import { IRequest, IMedia, IUserQueryString } from '@interfaces';
/**
 * @description
 */
export interface IUserRequest extends IRequest {
  user?: User|Record<string,unknown>;
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