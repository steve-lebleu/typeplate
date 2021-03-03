import { User } from '@models/user.model';
import { DeepPartial } from 'typeorm';
import { TYPE } from '@enums/mime-type.enum';

export interface IMedia {
  path: string;
  filename: string;
  size: number;
  destination: string;
  mimetype: TYPE;
  originalname?: string;
  url?: string;
  owner?: number | User | DeepPartial<User>;
}