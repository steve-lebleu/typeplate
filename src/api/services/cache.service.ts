
import { Request } from 'express';

import { ICache } from '@interfaces/ICache.interface';

import { CacheConfiguration } from '@config/cache.config';


/**
 * @description Cache service interface with memory cache module
 */
class CacheService {

  /**
   * @description
   */
  private static instance: CacheService;

  private constructor() {}

  static get(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * @description
   *
   * @param req Express request
   */
  key(req: Request): string {
    return `${CacheConfiguration.key}${req.originalUrl||req.url}`;
  }

  /**
   * @description
   *
   * @param req
   */
  isCachable(req: Request): boolean {
    return CacheConfiguration.options.IS_ACTIVE && req.method === 'GET';
  }

  /**
   * @description
   */
  get engine(): ICache {
    return CacheConfiguration.start
  }

  /**
   * @description
   */
  get duration(): number {
    return CacheConfiguration.options.DURATION;
  }

  /**
   * @description
   */
   get isActive(): boolean {
    return CacheConfiguration.options.IS_ACTIVE;
  }
}

const cacheService = CacheService.get();

export { cacheService as CacheService }