import { IRequest, IMedia } from '@interfaces';

/**
 * @description
 */
export interface IUserRequest extends IRequest {
  user?: any;
  logIn?: (user, { session }) => Promise<void>,
  files?: IMedia[]
}