import { User } from '@models/user.model';
import { DeepPartial } from 'typeorm';
import { MimeType } from '@types';

export interface IMedia {
  path: string;
  filename: string;
  size: number;
  destination: string;
  mimetype: MimeType;
  originalname?: string;
  url?: string;
  owner?: number | User | DeepPartial<User>;
}