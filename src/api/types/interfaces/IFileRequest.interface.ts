import { User } from '@models/user.model';
import { Request } from 'express';
import { DeepPartial } from 'typeorm';

export interface IFileRequest extends Request {
  user?: User;
  files?: { owner?: User | DeepPartial<User>, filename?: string }[];
  file?: { owner?: User | DeepPartial<User>, filename?: string };
  doc?: any;
  params: { mediaId?: number };
  body: { files?: { owner?: number, filename?: string }[], file?: { owner?: number, filename?: string } }
}