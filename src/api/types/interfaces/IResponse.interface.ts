import { Response } from 'express';
import { IModel } from '@interfaces/IModel.interface';
export interface IResponse extends Response {
  locals: { data?: Record<string, unknown> | Record<string, unknown>[] | IModel | IModel[] };
}