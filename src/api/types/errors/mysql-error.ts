import * as HTTP_STATUS from 'http-status';

import { IError } from '@interfaces/IError.interface';
import { IHTTPError } from '@interfaces/IHTTPError.interface';
import { IFieldError } from '@interfaces/IFieldError.interface';

export class MySQLError extends Error implements IHTTPError {

  readonly name = 'MySQL error';

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
    super();

    this.sqlMessage = error.sqlMessage;
    this.errno = error.errno;
    this.statusCode = this.getErrorStatus();
    this.statusText = 'Bad request';
    this.errors = [error.message];

  }

  /**
   * @description Get the error schema column name
   */
  private getErrorColumnName(): string {
    const start = this.sqlMessage.indexOf('\'');
    const restart = this.sqlMessage.substring(start + 1).indexOf('\'');
    return this.sqlMessage.substring(start + 1, start + restart + 1);
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
  private getErrorStatus(): number {

    switch (this.errno) {
      case 1052:
      case 1062:
      case 1452:
          return parseInt(HTTP_STATUS[409], 10);
      break;
      case 1364:
      case 1406:
          return parseInt(HTTP_STATUS[422], 10);
      break;
    }

  }
}