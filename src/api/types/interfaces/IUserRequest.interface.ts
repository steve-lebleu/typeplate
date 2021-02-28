import { Request } from 'express';

export interface IUserRequest extends Request {
    user: any
}