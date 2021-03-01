import { IHTTPError } from '@interfaces/IHTTPError.interface';
import { IFieldError } from '@interfaces/IFieldError.interface';

export class NotFoundError extends Error implements IHTTPError {

    /**
     * @description IError HTTP response status code
     */
    statusCode: number;

    /**
     * @description IError HTTP response status message
     */
    statusText: string;

    /**
     * @description Ierror HTTP response errors
     */
    errors: Array<IFieldError|string>;

    constructor() {
        super();
    }
}