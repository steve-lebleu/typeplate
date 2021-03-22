"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheConfiguration = void 0;
const mcache = require("memory-cache");
const environment_config_1 = require("@config/environment.config");
/**
 * @description Cache service interface with memory cache module
 */
class CacheConfiguration {
    constructor() {
        /**
         * @description
         */
        this.options = environment_config_1.MEMORY_CACHE;
    }
    /**
     * @description
     */
    get key() {
        return '__mcache_';
    }
    /**
     * @description
     */
    get start() {
        if (!this.engine) {
            this.engine = mcache;
        }
        return this.engine;
    }
    static get() {
        if (!CacheConfiguration.instance) {
            CacheConfiguration.instance = new CacheConfiguration();
        }
        return CacheConfiguration.instance;
    }
}
const cacheConfiguration = CacheConfiguration.get();
exports.CacheConfiguration = cacheConfiguration;
