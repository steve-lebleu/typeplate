import * as HTTP_STATUS from 'http-status';

import { IError, IHTTPError } from '@interfaces';

/**
 * @description Custom type MySQL error
 */
export class MySQLError implements Error, IHTTPError {

  readonly name = 'MySQLError';

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
    const converted = this.convertError(error.errno, error.message);
    this.statusCode = converted.statusCode;
    this.statusText = 'MySQL error';
    this.errors = [converted.error];
    this.stack = error?.stack;
  }

  /**
   * @description Fallback MySQL error when creating / updating fail
   *
   * @param error
   *
   * @example 1052 ER_NON_UNIQ_ERROR
   * @example 1054 ER_BAD_FIELD_ERROR
   * @example 1062 DUPLICATE_ENTRY
   * @example 1452 ER_NO_REFERENCED_ROW_2
   *
   * @example 1364 ER_NO_DEFAULT_FOR_FIELD
   * @example 1406 ER_DATA_TOO_LONG
   */
  private convertError(errno: number, message: string): { statusCode: number, statusText: string, error: string } {
    switch (errno) {
      case 1052:
        return { statusCode: 409, statusText: HTTP_STATUS['409_NAME'], error: message }
      case 1054:
        return { statusCode: 409, statusText: HTTP_STATUS['409_NAME'], error: message }
      case 1062:
        return { statusCode: 409, statusText: HTTP_STATUS['409_NAME'], error: message } // `Duplicate entry for ${/\'[a-z]{1,}\./.exec(message)[0].slice(1, -1).trim()}` not working in CI with MySQL < 8
      case 1452:
        return { statusCode: 409, statusText: HTTP_STATUS['409_NAME'], error: message }
      case 1364:
        return { statusCode: 422, statusText: HTTP_STATUS['422_NAME'], error: message }
      case 1406:
        return { statusCode: 422, statusText: HTTP_STATUS['422_NAME'], error: message }
      default:
        return { statusCode: 422, statusText: HTTP_STATUS['422_NAME'], error: message }
    }
  }
}