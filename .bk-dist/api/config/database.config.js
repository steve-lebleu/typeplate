"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const environment_config_1 = require("@config/environment.config");
const logger_service_1 = require("@services/logger.service");
/**
 * Typeorm default configuration
 *
 * @see https://http://typeorm.io
 */
class Database {
    constructor() { }
    /**
     * @description Connect to MySQL server
     * @async
     */
    static connect(options) {
        typeorm_1.createConnection({
            type: options.TYPE,
            name: options.NAME,
            host: options.HOST,
            port: options.PORT,
            username: options.USER,
            password: options.PWD,
            database: options.DB,
            entities: [options.ENTITIES],
            subscribers: [options.SUBSCRIBERS],
            synchronize: options.SYNC,
            logging: options.LOG,
            cache: options.CACHE
        })
            .then((connection) => {
            logger_service_1.Logger.log('info', `Connection to MySQL server established on port ${options.PORT} (${environment_config_1.ENV})`);
        })
            .catch((error) => {
            process.stdout.write(`error: ${error.message}`);
            process.exit(1);
        });
    }
}
exports.Database = Database;
