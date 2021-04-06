import { IRequest } from '@interfaces';

/**
 * @description
 */
export interface IUserRequest extends IRequest {
  user?: any;
  logIn?: (user, { session }) => Promise<void>,
}