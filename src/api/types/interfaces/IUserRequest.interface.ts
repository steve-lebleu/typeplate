import { Request } from 'express';

export interface IUserRequest extends Request {
    user?: any;
    logIn?: (user, { session }) => Promise<void>,
    params: { userId?: number } | any;
}