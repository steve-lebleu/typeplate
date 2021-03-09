import { MySQLError, NotFoundError, UploadError, ValidationError, ServerError } from '@errors';
import { IError } from '@interfaces/IError.interface';
import { badImplementation } from '@hapi/boom';
import { getErrorStatusCode } from '@utils/error.util';
import { IHTTPError } from '@interfaces/IHTTPError.interface';

export class ErrorFactory {

  constructor() {}

  /**
   * @description
   *
   * @param error
   */
  static get(error: IError): IHTTPError {

    // Custom errors first
    switch (error.name) {
      case 'QueryFailedError':
        return new MySQLError(error);
      case 'MulterError':
        return new UploadError(error);
      case 'EntityNotFound':
      case 'MustBeEntityError':
        return new NotFoundError(error);
      case 'ValidationError':
        return new ValidationError(error);
    }

    // JS native errors ( Error | EvalError | RangeError | SyntaxError | TypeError | URIError )
    if (!error.httpStatusCode && !error.statusCode && !error.status && !error?.output?.statusCode) {
      switch(error.constructor.name) {
        case 'Error':
        case 'EvalError':
        case 'TypeError':
        case 'SyntaxError':
        case 'RangeError':
        case 'URIError':
          return new ServerError(error);
        default:
          error = badImplementation(error.message) as IError;
      }
    }

    // Fallback with Boom error
    if (error.isBoom) {
      return {
        statusCode: getErrorStatusCode(error),
        statusText: error.output.payload.error,
        errors: [error.output.payload.message]
      };
    }

  }
}