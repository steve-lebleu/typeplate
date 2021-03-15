import { MediaType } from '@customtypes/media.type';
import { IQueryString } from '@interfaces/IQueryString.interface';

export interface IMediaQueryString extends IQueryString {
    path?: string;
    fieldname?: string;
    filename?: string;
    size?: number;
    mimetype?: string;
    owner?: string;
    type?: MediaType;
}