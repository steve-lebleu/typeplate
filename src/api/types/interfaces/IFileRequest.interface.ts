import { Request } from 'express';

export interface IFileRequest extends Request {
    user?: any;
    files?: any[];
    file?: { filename?: string };
    doc?: any;
    params: { documentId?: number };
}