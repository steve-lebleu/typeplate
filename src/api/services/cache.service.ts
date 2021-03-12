
import { Request } from 'express';
import * as mcache from 'memory-cache';

import { MEMORY_CACHE } from '@config/environment.config';
import { ICache } from '@interfaces/ICache.interface';

/**
 * @description Cache service interface with memory cache module
 */
export class Cache {

  /**
   * @description
   */
  static options = MEMORY_CACHE;

  /**
   * @description
   */
  private static instance: ICache = null;

  /**
   * @description
   */
  static get resolve(): ICache {
    if (!Cache.instance) {
      Cache.instance = mcache as ICache;
    }
    return Cache.instance;
  }

  /**
   * @description
   *
   * @param req Express request
   */
  static key(req: Request): string {
    return `__mcache_${req.originalUrl||req.url}`;
  }
}