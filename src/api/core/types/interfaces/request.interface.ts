import { Request } from 'express';

/**
 * @description
 */
export interface IRequest extends Request {
  user?: any;
  query: Record<string,string>,
  params: Record<string,string>;
}