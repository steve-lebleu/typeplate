import { Request } from 'express';

/**
 * @description
 */
export interface IRequest extends Request {
  user?: any;
  params: Record<string,string>;
}