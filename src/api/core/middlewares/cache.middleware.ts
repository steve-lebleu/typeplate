import { Request, Response } from 'express';
import { CacheService } from '@services/cache.service';

/**
 * @description
 */
class Cache {

  /**
   * @description
   */
  private static instance: Cache;

  private constructor() {}

  /**
   * @description
   */
  static get(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  /**
   * @description Request cache middleware
   *
   * @param req Express request
   * @param res Express response
   * @param next Middleware function
   */
  async read(req: Request, res: Response, next: () => void): Promise<void> {
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
}

const cache = Cache.get();

export { cache as Cache };