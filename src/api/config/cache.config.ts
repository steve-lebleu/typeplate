
import * as mcache from 'memory-cache';

import { MEMORY_CACHE } from '@config/environment.config';
import { ICache } from '@interfaces';

/**
 * @description Cache service interface with memory cache module
 */
class CacheConfiguration {

  /**
   * @description
   */
  private static instance: CacheConfiguration;

  /**
   * @description
   */
  options = MEMORY_CACHE;

  /**
   * @description
   */
  private engine: ICache;

  /**
   * @description
   */
  get key() {
    return '__mcache_'
  }

  /**
   * @description
   */
  get start(): ICache {
    if (!this.engine) {
      this.engine = mcache as ICache;
    }
    return this.engine;
  }

  private constructor() {}

  static get(): CacheConfiguration {
    if (!CacheConfiguration.instance) {
      CacheConfiguration.instance = new CacheConfiguration();
    }
    return CacheConfiguration.instance;
  }

}

const cacheConfiguration = CacheConfiguration.get();

export { cacheConfiguration as CacheConfiguration }