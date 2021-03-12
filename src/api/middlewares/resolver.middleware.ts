import { Request } from 'express';
import { NOT_FOUND } from 'http-status';
import { IResponse } from '@interfaces/IResponse.interface';
import { expectationFailed } from '@hapi/boom';
import { getStatusCode } from '@utils/http.util';
import { Cache } from '@services/cache.service';

/**
 * @description Resolve the current request and get output. The princip is that we becomes here, it means that none error has been encountered except a potential and non declared as is 404 error
 *
 * @param req Express request object derived from http.incomingMessage
 * @param res Express response object
 * @param next Callback function
 */
const Resolver = async (req: Request, res: IResponse, next: (e?: Error) => void): Promise<void> => {

  const hasContent = typeof res.locals?.data !== 'undefined';
  const hasStatusCodeOnResponse = typeof res.statusCode !== 'undefined';
  const status = getStatusCode(req.method, hasContent);

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
    if (req.method === 'GET' && Cache.options.IS_ACTIVE) {
      Cache.resolve.put( Cache.key(req), res.locals.data, Cache.options.DURATION );
    }
    res.status( status );
    res.json(res.locals.data);
  }

}

export { Resolver }