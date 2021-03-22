"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const logger_config_1 = require("@config/logger.config");
/**
 * Log service
 */
class Logger {
    constructor(engine) {
        this.engine = engine;
    }
    static get(engine) {
        if (!Logger.instance) {
            Logger.instance = new Logger(engine);
        }
        return Logger.instance;
    }
    /**
     * @description Do log action
     *
     * @param level
     * @param message
     */
    log(level, message) {
        this.engine[level](message);
    }
}
const logger = Logger.get(logger_config_1.LoggerConfiguration.logger);
exports.Logger = logger;
