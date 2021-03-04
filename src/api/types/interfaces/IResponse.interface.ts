import { Response } from 'express';
import { IModel } from './IModel.interface';
export interface IResponse extends Response {
  // locals: { data?: { statusCode?: number, fieldname?: string, token?: any } | any[] };
  locals: { data?: Record<string, unknown> | IModel | IModel[] };
}