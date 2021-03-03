import { IHTTPError } from '@interfaces/IHTTPError.interface';
import { IFieldError } from '@interfaces/IFieldError.interface';
import { IError } from '@interfaces/IError.interface';

/**
 * Type upload error
 */
export class UploadError extends Error implements IHTTPError {

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
  errors: Array<IFieldError|string>;

  /**
   * @param status
   * @param message
   * @param errors
   */
  constructor(error: IError) {
    super();
    this.statusCode = 400;
    this.statusText = error.name;
    this.errors = [error.message];
  }

}