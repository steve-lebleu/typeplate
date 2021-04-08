import { ValidationErrorItem } from 'joi';
import * as HTTP_STATUS from 'http-status';

import { IError, IHTTPError } from '@interfaces';
import { TypeplateError } from '@errors';

/**
 * Type upload error
 */
export class ValidationError extends TypeplateError implements IHTTPError {

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
    super('A validation error was occurred')
    this.statusCode = 400;
    this.statusText = 'Validation failed';
    this.errors = this.convertError(error.details);
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