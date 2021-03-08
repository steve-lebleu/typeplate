import { Request } from 'express';
import { CREATED, OK, NO_CONTENT, NOT_FOUND } from 'http-status';
import { IResponse } from '@interfaces/IResponse.interface';
import { expectationFailed } from '@hapi/boom';

/**
 * Resolver middleware that close all requests by response sending (404 except)
 */
export class Resolver {

  constructor() {}

  /**
   * @description Resolve the current request and get output. The princip is that we becomes here, it means that none error has been encountered except a potential and non declared as is 404 error
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  static async resolve(req: Request, res: IResponse, next: (e?: Error) => void): Promise<void> {

    const hasContent = typeof res.locals?.data !== 'undefined';
    const hasStatusCodeOnResponse = typeof res.statusCode !== 'undefined';

    if ( req.method === 'DELETE' ) {
      // As trick but necessary because if express don't match route we can't give a 204/404 on DELETE
      if ( isNaN( parseInt(req.url.split('/').pop(), 10) )) {
        return next( expectationFailed('ID parameter must be a number') );
      }
      res.status( Resolver.getStatusCode(req.method, hasContent) )
      res.end();
    }

    // FIXME Should be reviewed because it can be at origin of non-blocking error HEADER_CANNOT_BE_SET_AFTER_RESPONSE_SENDING
    if ( !hasContent ) {
      next();
    }

    if ( ( hasContent && ['GET', 'POST', 'PUT', 'PATCH'].includes(req.method) ) || ( hasStatusCodeOnResponse && res.statusCode !== NOT_FOUND ) ) {
      res.status( Resolver.getStatusCode(req.method, hasContent) );
      res.json(res.locals.data);
    }

  }

  /**
   * @description Get the HTTP status code to output for current request
   *
   * @param method
   * @param hasContent
   */
  private static getStatusCode(method: string, hasContent: boolean): number {
    switch (method) {
      case 'GET':
        return OK;
      case 'POST':
        return hasContent ? CREATED : NO_CONTENT;
      case 'PUT':
      case 'PATCH':
        return hasContent ? OK : NO_CONTENT;
      case 'DELETE':
        return NO_CONTENT
    }
  }

}