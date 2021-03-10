import { Request, Response } from 'express';
import { Cache } from '@services/cache.service';
import { CACHE } from '@enums/cache.enum';

/**
 * @description Request cache middleware
 *
 * @param req Express request
 * @param res Express response
 * @param next Middleware function
 */
const Kache = async (req: Request, res: Response, next: () => void): Promise<void> => {
  if (req.method !== 'GET' || !Cache.options.isActive || Cache.options.type !== CACHE.MEMORY) {
    return next();
  }
  const cached = Cache.resolve.get( Cache.key(req) ) as unknown ;
  if (cached) {
    res.status(200);
    res.json(cached);
    return;
  }
  next();
}

export { Kache }