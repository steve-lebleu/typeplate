import { IHTTPError } from '@interfaces/IHTTPError.interface';
import { IFieldError } from '@interfaces/IFieldError.interface';
import { IError } from '@interfaces/IError.interface';

export class NotFoundError extends Error implements IHTTPError {

  readonly name = 'Entity not found error';

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

  constructor(error: IError) {
    super();

    this.statusCode = 404;
    this.statusText = 'Bad request';
    this.errors = [error.message];
  }
}