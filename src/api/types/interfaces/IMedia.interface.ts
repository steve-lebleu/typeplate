import { User } from '@models/user.model';
import { DeepPartial } from 'typeorm';
import { VIDEO_TYPE, AUDIO_TYPE, ARCHIVE_TYPE, DOCUMENT_TYPE, IMAGE_TYPE } from '@enums/mime-type.enum';

export interface IMedia {
  path: string;
  filename: string;
  size: number;
  destination: string;
  mimetype: VIDEO_TYPE | AUDIO_TYPE | ARCHIVE_TYPE | IMAGE_TYPE | DOCUMENT_TYPE;
  originalname?: string;
  url?: string;
  owner?: number | User | DeepPartial<User>;
}