"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resolve = void 0;
const http_status_1 = require("http-status");
const boom_1 = require("@hapi/boom");
const http_util_1 = require("@utils/http.util");
const cache_service_1 = require("@services/cache.service");
/**
 * @description
 */
class Resolve {
    constructor() { }
    /**
     * @description
     */
    static get() {
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
    async write(req, res, next) {
        const hasContent = typeof res.locals?.data !== 'undefined';
        const hasStatusCodeOnResponse = typeof res.statusCode !== 'undefined';
        const status = http_util_1.getStatusCode(req.method, hasContent);
        if (req.method === 'DELETE') {
            // As trick but necessary because if express don't match route we can't give a 204/404 on DELETE
            if (isNaN(parseInt(req.url.split('/').pop(), 10))) {
                return next(boom_1.expectationFailed('ID parameter must be a number'));
            }
            res.status(status);
            res.end();
            return;
        }
        // The door for 404 candidates
        if (!hasContent) {
            next();
        }
        // The end for the rest
        if ((hasContent && ['GET', 'POST', 'PUT', 'PATCH'].includes(req.method)) || (hasStatusCodeOnResponse && res.statusCode !== http_status_1.NOT_FOUND)) {
            if (cache_service_1.CacheService.isCachable(req)) {
                cache_service_1.CacheService.engine.put(cache_service_1.CacheService.key(req), res.locals.data, cache_service_1.CacheService.duration);
            }
            res.status(status);
            res.json(res.locals.data);
        }
    }
}
const resolve = Resolve.get();
exports.Resolve = resolve;
