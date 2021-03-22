import { IError, IHTTPError } from '@interfaces';

/**
 * @description Custom NotFoundError
 */
export class NotFoundError implements Error, IHTTPError {

  readonly name = 'NotFoundError';

  /**
   * @description Error.message implementation
   */
   message: string;

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
  errors: Array<string>;

  /**
   * @description Error stack
   */
  stack: string;

  constructor(error: IError) {
    this.statusCode = 404;
    this.statusText = 'Bad request';
    this.errors = [error.message];
    this.stack = error?.stack;
  }
}