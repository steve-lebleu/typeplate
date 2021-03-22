import { IError, IHTTPError } from '@interfaces';

/**
 * @description Type upload error
 */
export class UploadError implements Error, IHTTPError {

  readonly name = 'UploadError';

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
    this.statusCode = 400;
    this.statusText = error.name;
    this.errors = [error.message];
    this.stack = error?.stack;
  }

}