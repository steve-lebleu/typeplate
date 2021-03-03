import { badImplementation } from 'boom';

import { IError } from '@interfaces/IError.interface';
import { IHTTPError } from '@interfaces/IHTTPError.interface';
import { ValidationError } from 'express-validation';
import { UploadError } from '@errors/upload-error';
import { MySQLError } from '@errors/mysql-error';
import { NotFoundError } from '@errors/not-found-error';


/**
 * @description Get error status code
 * @param error Error object
 * @returns HTTP status code
 */
const getErrorStatusCode = (error: IError): number => {
  if(typeof(error.statusCode) !== 'undefined') return error.statusCode;
  if(typeof(error.status) !== 'undefined') return error.status;
  if(typeof(error?.output?.statusCode) !== 'undefined') return error.output.statusCode;
  return 500;
};

/**
 * @description Get error object for output
 * @param error Error object
 * @returns Formalized error object
 */
const getErrorOutput = (error: IError): IHTTPError => {

  // JS native ( Error | EvalError | RangeError | SyntaxError | TypeError | URIError )
  if (!error.httpStatusCode && !error.statusCode && !error.status && !error?.output?.statusCode) {
    switch(error.constructor.name) {
      case 'Error':
      case 'EvalError':
      case 'TypeError':
      case 'SyntaxError':
      case 'RangeError':
      case 'URIError':
        error = badImplementation(error.message) as IError;
      break;
      default:
        error = badImplementation(error.message) as IError;
    }
  }

  if (error.isBoom) {
    return {
      statusCode: getErrorStatusCode(error),
      statusText: error.output.payload.error,
      errors: [error.output.payload.message]
    };
  } else if (error instanceof NotFoundError) {
    return error;
  } else if (error instanceof MySQLError) {
    return error;
  } else if (error instanceof UploadError) {
    return error;
  } else if (error instanceof ValidationError) {
    return {
      statusCode: getErrorStatusCode(error),
      statusText: error.statusText,
      errors: error.errors.map( (err: { field: string, types, messages: string[] }) => err.messages.join(',').replace(/"/g, '\''))
    };
  }

};

export { getErrorStatusCode, getErrorOutput };