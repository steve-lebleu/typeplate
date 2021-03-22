import { IRequest } from '@interfaces/IRequest.interface';

/**
 * @description
 */
export interface IUserRequest extends IRequest {
  user?: any;
  logIn?: (user, { session }) => Promise<void>,
}