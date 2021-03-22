"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerConfiguration = void 0;
const fs_1 = require("fs");
const Winston = require("winston");
const Morgan = require("morgan");
const winston_1 = require("winston");
const environment_config_1 = require("@config/environment.config");
const _enums_1 = require("@enums");
/**
 * @see https://github.com/winstonjs/winston
 * @see https://github.com/expressjs/morgan
 */
class LoggerConfiguration {
    constructor() {
        /**
         * @description
         */
        this.stream = {
            write: (message) => {
                this.logger.info(message.substring(0, message.lastIndexOf('\n')));
            }
        };
        /**
         * @description Output format
         */
        this.formater = winston_1.format.printf(({ level, message, label, timestamp }) => {
            return `${timestamp} [${level}] ${message}`;
        });
        /**
         * @description Default options
         */
        this.options = {
            error: {
                level: 'error',
                format: winston_1.format.combine(winston_1.format.timestamp(), this.formater),
                filename: `${environment_config_1.LOGS.PATH}/error.log`,
                handleException: true,
                json: true,
                maxSize: 5242880,
                maxFiles: 5,
                colorize: false,
            },
            info: {
                level: 'info',
                format: winston_1.format.combine(winston_1.format.timestamp(), this.formater),
                filename: `${environment_config_1.LOGS.PATH}/combined.log`,
                handleException: false,
                json: true,
                maxSize: 5242880,
                maxFiles: 5,
                colorize: false,
            },
            console: {
                format: Winston.format.simple(),
                level: 'debug',
                handleExceptions: true,
                json: false,
                colorize: true,
            }
        };
    }
    /**
     * @description
     */
    static get() {
        if (!LoggerConfiguration.instance) {
            LoggerConfiguration.instance = new LoggerConfiguration();
        }
        return LoggerConfiguration.instance;
    }
    /**
     * @description Initialize default logger configuration
     */
    init() {
        if (LoggerConfiguration.instance && this.logger) {
            return this;
        }
        this.logger = Winston.createLogger({
            level: 'info',
            transports: [
                //
                // - Write to all logs with level `info` and below to `combined.log`
                // - Write all logs error (and below) to `error.log`.
                //
                new Winston.transports.File(this.options.error),
                new Winston.transports.File(this.options.info),
            ],
            exitOnError: false
        });
        if (!['production', 'test'].includes(environment_config_1.ENV)) {
            this.logger.add(new Winston.transports.Console(this.options.console));
        }
        return this;
    }
    /**
     * @description
     */
    writeStream() {
        return Morgan(environment_config_1.LOGS.TOKEN, { stream: (environment_config_1.ENV === _enums_1.ENVIRONMENT.production ? fs_1.createWriteStream(`${environment_config_1.LOGS.PATH}/access.log`, { flags: 'a+' }) : this.stream) });
    }
}
const config = LoggerConfiguration
    .get()
    .init();
exports.LoggerConfiguration = config;
