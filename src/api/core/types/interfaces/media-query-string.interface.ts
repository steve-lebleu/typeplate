import { MediaType } from '@types';
import { IQueryString } from '@interfaces';

export interface IMediaQueryString extends IQueryString {
  path?: string;
  fieldname?: string;
  filename?: string;
  size?: number;
  mimetype?: string;
  owner?: string;
  type?: MediaType;
}