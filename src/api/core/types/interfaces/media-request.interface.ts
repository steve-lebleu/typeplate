import { User } from '@models/user.model';
import { IMedia, IRequest } from '@interfaces';

/**
 * @description
 */
export interface IMediaRequest extends IRequest {
  body: { files?: IMedia[], file?: IMedia }
  file?: IMedia;
  files?: IMedia[];
  user?: User;
}