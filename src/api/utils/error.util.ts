import { badData, badImplementation, conflict, notFound } from "boom";

import { IError } from "@interfaces/IError.interface";
import { ValidationError } from "express-validation";
import { UploadError } from "@errors/upload-error";

/**
 * @description Fallback error function when creating / updating fail
 * 
 * @param {QueryFailedError} error 
 * 
 * @example 1052 ER_NON_UNIQ_ERROR 
 * @example 1062 DUPLICATE_ENTRY 
 * @example 1452 ER_NO_REFERENCED_ROW_2
 * 
 * @example 1364 ER_NO_DEFAULT_FOR_FIELD 
 * @example 1406 ER_DATA_TOO_LONG
 */
const checkMySQLError = (error: any) => {
  if (error.name === 'QueryFailedError') { 
    if([1052, 1062, 1452].includes(error.errno)) {
      return conflict( 'MySQL validation error', { // 409
        errors: [{
          field: getErrorColumnName(error),
          location: 'body',
          messages: [error.sqlMessage],
        }]
      });
    }
    if([1364, 1406].includes(error.errno)) {
      return badData( 'MySQL validation error', { // 422
        errors: [{
          field: getErrorColumnName(error),
          location: 'body',
          messages: [error.sqlMessage],
        }]
      });
    }
  }
  if (error.name === 'EntityNotFound') {
    return notFound(error.message)
  }
  return error;
}

/**
 * @description Get the error schema column name
 * 
 * @param {QueryFailedError} error 
 */
const getErrorColumnName = (error): string => {
  const start = parseInt(error.sqlMessage.indexOf("'"), 10);
  const restart = parseInt(error.sqlMessage.substring(start + 1).indexOf("'"), 10);
  return error.sqlMessage.substring(start + 1, start + restart + 1);
};

/**
 * @description Get error status code
 * @param {Object} error Error object
 * @returns {Number} HTTP status code 
 */
const getErrorStatusCode = (error): number => {
  if(typeof(error.statusCode) !== 'undefined') return error.statusCode;
  if(typeof(error.status) !== 'undefined') return error.status;
  if(error.isBoom) return error.output.statusCode;
  return 500;
};

/**
 * @description Get error object for output
 * @param {Object} error Error object
 * @returns {IError} Formalized error object
 */
const getErrorOutput = (error): IError => {

  // This fix Travis test failure in auth.test. Yes, yes.
  console.log(error);
  console.log(error.message);

  // JS native ( Error | EvalError | RangeError | SyntaxError | TypeError | URIError )
  if (!error.httpStatusCode && !error.statusCode && !error.status && !error.isBoom) { 
    switch(error.constructor.name) {
      case 'Error': 
      case 'EvalError': 
      case 'TypeError': 
      case 'SyntaxError': 
      case 'RangeError': 
      case 'URIError': 
        error = badImplementation(error.message);
      break;
      default:
        error = badImplementation(error.message);
    }
  }
  
  if (error.isBoom) {
    return {
      statusCode: getErrorStatusCode(error),
      statusText: error.output.payload.error,
      errors: [error.output.payload.message]
    }; 
  } else if (error instanceof UploadError) {
    return error; 
  } else if (error instanceof ValidationError) {
    return {
      statusCode: getErrorStatusCode(error),
      statusText: error.statusText,
      errors: error.errors.map( (err: any) => { 
        return { field: err.field.join('.'), types: err.types, messages: err.messages }; 
      })
    }; 
  } 

};

export { checkMySQLError, getErrorColumnName, getErrorStatusCode, getErrorOutput };