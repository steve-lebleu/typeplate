import { Request, Response } from 'express';
import { CacheService } from '@services/cache.service';

/**
 * @description Request cache middleware
 *
 * @param req Express request
 * @param res Express response
 * @param next Middleware function
 */
const Cache = async (req: Request, res: Response, next: () => void): Promise<void> => {
  if ( !CacheService.isCachable(req) ) {
    return next();
  }
  const cached = CacheService.engine.get( CacheService.key(req) ) as unknown ;
  if (cached) {
    res.status(200);
    res.json(cached);
    return;
  }
  next();
}

export { Cache }