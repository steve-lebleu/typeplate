import { IQueryString } from '@interfaces/IQueryString.interface';

export interface IDocumentQueryString extends IQueryString {
    path?: string;
    fieldname?: string;
    filename?: string;
    size?: number;
    mimetype?: string;
    owner?: string;
}