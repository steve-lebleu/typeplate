"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const cache_config_1 = require("@config/cache.config");
const string_util_1 = require("@utils/string.util");
/**
 * @description Cache service interface with memory cache module
 */
class CacheService {
    constructor() { }
    static get() {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService();
        }
        return CacheService.instance;
    }
    /**
     * @description
     */
    get engine() {
        return cache_config_1.CacheConfiguration.start;
    }
    /**
     * @description
     */
    get duration() {
        return cache_config_1.CacheConfiguration.options.DURATION;
    }
    /**
     * @description
     */
    get isActive() {
        return cache_config_1.CacheConfiguration.options.IS_ACTIVE;
    }
    /**
     * @description
     *
     * @param req Express request
     */
    key(req) {
        let queryParams = '';
        if (req.query) {
            queryParams = string_util_1.encrypt(Object.keys(req.query).sort().map(key => req.query[key]).join(''));
        }
        return `${cache_config_1.CacheConfiguration.key}${req.baseUrl}${req.path}?q=${queryParams}`;
    }
    /**
     * @description
     *
     * @param req
     */
    isCachable(req) {
        return cache_config_1.CacheConfiguration.options.IS_ACTIVE && req.method === 'GET';
    }
    /**
     * @description Refresh cache after insert / update
     *
     * @param segment
     */
    refresh(segment) {
        if (!cache_config_1.CacheConfiguration.options.IS_ACTIVE) {
            return false;
        }
        this.engine
            .keys()
            .slice()
            .filter(key => key.includes(segment))
            .forEach(key => this.engine.del(key));
    }
}
const cacheService = CacheService.get();
exports.CacheService = cacheService;
