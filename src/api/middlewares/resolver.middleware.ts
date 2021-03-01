import { Request } from 'express';
import { NO_CONTENT } from 'http-status';
import { expectationFailed } from 'boom';
import { IResponse } from '@interfaces/IResponse.interface';

/**
 * Resolver middleware that close all requests by response sending (404 except)
 */
export class Resolver {

  constructor() {}

  /**
   * @description Resolve the current request and get output
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   *
   * FIXME: The check on id parameter should be on validation -> change doRequest by doQueryRequest allow 400, by validation error.
   * For other methods (PUP, PATCH, DELETE), find other solution
   */
  static resolve = (req: Request, res: IResponse, next: (error?: Error) => void): void => {

    const cond = typeof res.locals.data !== 'undefined' && res.locals.data.hasOwnProperty('statusCode') ;

    // Success DELETE request which have 204 statusCode : we get out
    if (req.method === 'DELETE') {
      if (res.statusCode === NO_CONTENT) {
        res.end();
      } else if ( isNaN( parseInt(req.url.split('/').pop(), 10) )) {
        return next( expectationFailed('ID parameter must be a number') );
      }
    }

    // If the current request don't match with previous conditions,  next to 404
    if (typeof(res.locals.data) === 'undefined') {
      next();
    }

    // All of these methods can returns an empty result set, but a result set
    if ( ( cond && ['GET', 'POST', 'PUT', 'PATCH'].includes(req.method) ) || ( typeof res.statusCode !== 'undefined' && res.statusCode !== 404 ) ) {
      res.statusCode = res.locals.data.statusCode || res.statusCode;
      res.json(res.locals.data);
    }

  }

}