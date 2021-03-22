"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const cache_service_1 = require("@services/cache.service");
/**
 * @description
 */
class Cache {
    constructor() { }
    /**
     * @description
     */
    static get() {
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
    async read(req, res, next) {
        if (!cache_service_1.CacheService.isCachable(req)) {
            return next();
        }
        const cached = cache_service_1.CacheService.engine.get(cache_service_1.CacheService.key(req));
        if (cached) {
            res.status(200);
            res.json(cached);
            return;
        }
        next();
    }
}
const cache = Cache.get();
exports.Cache = cache;
