import { IQueryString } from '@interfaces';

export interface IUserQueryString extends IQueryString {
  username?: string;
  email?: string;
  role?: string;
  confirmed?: boolean;
}