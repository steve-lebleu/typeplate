import * as HTTP_STATUS from 'http-status';

import { IError, IHTTPError } from '@interfaces';
import { TypeplateError } from '@errors';

/**
 * @description Custom type MySQL error
 */
export class MySQLError extends TypeplateError implements IHTTPError {

  /**
   * @description HTTP response status code
   */
  statusCode: number;

  /**
   * @description HTTP response status message
   */
  statusText: string;

  /**
   * @description HTTP response errors
   */
  errors: Array<string>;

  constructor(error: IError) {
    super('MySQL engine was failed');
    const converted = this.convertError(error.errno, error.message);
    this.statusCode = converted.statusCode;
    this.statusText = converted.statusText;
    this.errors = [ converted.error ];
  }

  /**
   * @description Fallback MySQL error when creating / updating fail
   *
   * @param errno
   * @param message
   *
   * @example 1052 ER_NON_UNIQ_ERROR
   * @example 1054 ER_BAD_FIELD_ERROR
   * @example 1062 DUPLICATE_ENTRY
   * @example 1452 ER_NO_REFERENCED_ROW_2
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