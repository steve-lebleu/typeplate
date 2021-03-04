import { Request } from 'express';
export interface IJsonApiRequest extends Request {
  body: { data?: any|any[] };
}