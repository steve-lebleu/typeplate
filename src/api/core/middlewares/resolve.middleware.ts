import { Request } from 'express';
import { NOT_FOUND } from 'http-status';
import { expectationFailed } from '@hapi/boom';

import { IResponse } from '@interfaces';
import { getStatusCode } from '@utils/http.util';
import { CacheService } from '@services/cache.service';

/**
 * @description
 */
 class Resolve {

  /**
   * @description
   */
  private static instance: Resolve;

  private constructor() {}

  /**
   * @description
   */
  static get(): Resolve {
    if (!Resolve.instance) {
      Resolve.instance = new Resolve();
    }
    return Resolve.instance;
  }

  /**
   * @description Resolve the current request and get output. The princip is that we becomes here, it means that none error has been encountered except a potential and non declared as is 404 error
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
   async write(req: Request, res: IResponse, next: (e?: Error) => void): Promise<void> {

    const hasContent = typeof res.locals?.data !== 'undefined';
    const hasNullContent = res.locals.data === null;
    const hasStatusCodeOnResponse = typeof res.statusCode !== 'undefined';
    const status = getStatusCode(req.method, ( hasContent && !hasNullContent ));

    if ( req.method === 'DELETE' ) {
      // As trick but necessary because if express don't match route we can't give a 204/404 on DELETE
      if ( isNaN( parseInt(req.url.split('/').pop(), 10) )) {
        return next( expectationFailed('ID parameter must be a number') );
      }
      res.status( status )
      res.end();
      return;
    }

    // The door for 404 candidates
    if ( !hasContent ) {
      next();
    }

    // The end for the rest
    if ( ( hasContent && ['GET', 'POST', 'PUT', 'PATCH'].includes(req.method) ) || ( hasStatusCodeOnResponse && res.statusCode !== NOT_FOUND ) ) {
      if ( CacheService.isCachable(req) ) {
        CacheService.engine.put( CacheService.key(req), res.locals.data, CacheService.duration );
      }
      res.status( status );
      if (res.locals.meta) {
        res.json(res.locals);
      } else {
        res.json(res.locals.data);
      }
    }
  }
}

const resolve = Resolve.get();

export { resolve as Resolve };