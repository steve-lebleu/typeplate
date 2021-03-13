import { IHTTPError } from '@interfaces/IHTTPError.interface';
import { IError } from '@interfaces/IError.interface';

/**
 * @description Type native error
 */
export class ServerError implements Error, IHTTPError {

  readonly name = 'ServerError';

  /**
   * @description Error.message implementation
   */
   message: string;

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

  /**
   * @description Error stack
   */
  stack: string;

  constructor(error: IError) {
    this.statusCode = 500;
    this.statusText = 'Ooops... server seems to be broken';
    this.errors = ['Looks like someone\'s was not there while the meeting\''];
    this.stack = error?.stack;
  }

}