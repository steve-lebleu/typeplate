import { RefreshToken } from '@models/refresh-token.model';

export interface ITokenOptions {
  password?: string;
  email: string;
  apikey?: string;
  refreshToken: RefreshToken
}