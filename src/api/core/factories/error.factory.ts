import { badImplementation } from '@hapi/boom';
import { MySQLError, NotFoundError, UploadError, ValidationError, ServerError, BusinessError } from '@errors';
import { IError, IHTTPError } from '@interfaces';
import { getErrorStatusCode } from '@utils/error.util';

/**
 * @description
 */
export class ErrorFactory {

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
      case 'BusinessError':
        return error as BusinessError;
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