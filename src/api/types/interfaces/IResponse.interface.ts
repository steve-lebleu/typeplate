import { Response } from 'express';

export interface IResponse extends Response {
  locals: { data?: any };
}