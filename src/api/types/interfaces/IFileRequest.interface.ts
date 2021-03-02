import { Request } from 'express';

export interface IFileRequest extends Request {
    user?: { id?: number };
    files?: { owner?: number, filename?: string }[];
    file?: { owner?: number, filename?: string };
    doc?: any;
    params: { documentId?: number };
    body: { files?: { owner?: number, filename?: string }[], file?: { owner?: number, filename?: string } }
}