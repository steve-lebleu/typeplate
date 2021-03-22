import { IError } from '@interfaces';

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

export { getErrorStatusCode };