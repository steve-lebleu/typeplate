import { Request } from 'express';

export interface IFileRequest extends Request {
    user?: any,
    files?: any[],
    file?: any,
    doc?: any
}