import { IRequest, IMedia } from '@interfaces';

/**
 * @description
 */
export interface IUserRequest extends IRequest {
  user?: any;
  logIn?: (user, { session }) => Promise<void>,
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
    page?: any,
    perPage?: any
  }
}