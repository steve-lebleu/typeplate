import { User } from '@models/user.model';
import { Request } from 'express';
import { IMedia } from '@interfaces/IMedia.interface';

export interface IMediaRequest extends Request {
  user?: User;
  files?: IMedia[];
  file?: IMedia;
  doc?: any;
  params: { mediaId?: number };
  body: { files?: IMedia[], file?: IMedia }
}