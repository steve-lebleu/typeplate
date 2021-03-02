import { Response } from 'express';
import { IModelize } from './IModelize.interface';
export interface IResponse extends Response {
  // locals: { data?: { statusCode?: number, fieldname?: string, token?: any } | any[] };
  locals: { data?: Record<string, unknown> | IModelize | IModelize[] };
}