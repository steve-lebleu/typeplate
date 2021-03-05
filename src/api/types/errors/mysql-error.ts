import * as HTTP_STATUS from 'http-status';

import { IError } from '@interfaces/IError.interface';
import { IHTTPError } from '@interfaces/IHTTPError.interface';
import { IFieldError } from '@interfaces/IFieldError.interface';

export class MySQLError implements Error, IHTTPError {

  readonly name = 'MySQL error';

  /**
   * @description Error.message implementation
   */
  message: string;

  /**
   * @description MySQL errno value
   */
  errno: number;

  /**
   * @description MySQL error message
   */
  sqlMessage: string;

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
    const converted = this.convertError(error.errno, error.message);
    this.sqlMessage = error.sqlMessage;
    this.errno = error.errno;
    this.statusCode = converted.statusCode;
    this.statusText = converted.statusText;
    this.errors = [converted.error];
  }

  /**
   * @description Fallback MySQL error when creating / updating fail
   *
   * @param error
   *
   * @example 1052 ER_NON_UNIQ_ERROR
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
      case 1062:
        return { statusCode: 409, statusText: HTTP_STATUS['409_NAME'], error: message }
      case 1452:
        return { statusCode: 409, statusText: HTTP_STATUS['409_NAME'], error: message }
      case 1364:
        return { statusCode: 422, statusText: HTTP_STATUS['422_NAME'], error: message }
      case 1406:
        return { statusCode: 422, statusText: HTTP_STATUS['422_NAME'], error: message }
    }
  }
}