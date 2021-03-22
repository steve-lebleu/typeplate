import { User } from '@models/user.model';
import { IMedia } from '@interfaces';
import { IRequest } from '@interfaces/IRequest.interface';

/**
 * @description
 */
export interface IMediaRequest extends IRequest {
  body: { files?: IMedia[], file?: IMedia }
  file?: IMedia;
  files?: IMedia[];
  user?: User;
}