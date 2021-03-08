import { IHTTPError } from '@interfaces/IHTTPError.interface';
import { IError } from '@interfaces/IError.interface';
import { ValidationErrorItem } from 'joi';

/**
 * Type upload error
 */
export class ValidationError implements Error, IHTTPError {

  readonly name = 'ValidationError';

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
    this.statusText = 'Validation error';
    this.errors = this.convertError(error.details);
    this.stack = error?.stack;
  }

  /**
   * @description Convert Joi validation errors into strings
   *
   * @param errors Array of Joi validation errors
   */
  private convertError(errors: ValidationErrorItem[]): string[] {
    return errors.map( (err: ValidationErrorItem) => err.message.replace(/"/g, '\'') )
  }
}