import { Response } from 'express';

export interface IResponse extends Response {
  locals: { data?: { statusCode?: number, fieldname?: string } | any[] };
}