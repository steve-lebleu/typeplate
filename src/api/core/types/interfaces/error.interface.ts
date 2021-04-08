import { ValidationErrorItem } from 'joi';

/**
 * Define generic Error interface
 */
export interface IError {

  /**
   * @description Error name
   */
  name: string;

  /**
   * @description MySQL error status code
   */
  errno?: number;

  /**
   * @description MySQL error message
   */
  sqlMessage?: string;

  /**
   * @description Error message
   */
  message?: string;

  /**
   * @description Error call stack
   */
  stack?: string;

  /**
   * @description Error status alias
   */
  httpStatusCode?: number;

  /**
   * @description Error status alias
   */
  status?: number;

  /**
   * @description Error status alias
   */
  statusCode?: number;

  /**
   * @description Boom error output
   */
  output?: { statusCode?: number, payload?: { error: string, message: string } };

  /**
   * @description Boom error descriptor
   */
  isBoom?: boolean;

  /**
   * @description Joi error descriptor
   */
   isJoi?: boolean;

  /**
   * @description Validation error message
   */
  statusText?: string;

  /**
   * @description Error details
   */
  errors?: { field, types, messages }[] | string[];

  /**
   * @description Validation error details
   */
  details?: ValidationErrorItem[]
}