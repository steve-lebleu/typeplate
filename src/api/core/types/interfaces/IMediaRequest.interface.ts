import { User } from '@models/user.model';
import { Request } from 'express';
import { IMedia } from '@interfaces';

export interface IMediaRequest extends Request {
  user?: User;
  files?: IMedia[];
  file?: IMedia;
  doc?: any;
  params: Record<string,string>;
  body: { files?: IMedia[], file?: IMedia }
}