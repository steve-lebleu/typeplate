"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = exports.ServerConfiguration = void 0;
const fs_1 = require("fs");
const https_1 = require("https");
const environment_config_1 = require("@config/environment.config");
const logger_service_1 = require("@services/logger.service");
/**
 * @description
 */
class ServerConfiguration {
    constructor() {
        /**
         * @description
         */
        this.options = {
            credentials: {
                key: environment_config_1.SSL.IS_ACTIVE ? fs_1.readFileSync(environment_config_1.SSL.KEY, 'utf8') : null,
                cert: environment_config_1.SSL.IS_ACTIVE ? fs_1.readFileSync(environment_config_1.SSL.CERT, 'utf8') : null,
            },
            port: environment_config_1.PORT
        };
    }
    /**
     * @description
     */
    static get() {
        if (!ServerConfiguration.instance) {
            ServerConfiguration.instance = new ServerConfiguration();
        }
        return ServerConfiguration.instance;
    }
    /**
     * @description
     *
     * @param app Express application
     */
    init(app) {
        this.server = !this.server ? environment_config_1.SSL.IS_ACTIVE ? https_1.createServer(this.options.credentials, app) : app : this.server;
        return this;
    }
    /**
     * @description
     */
    listen() {
        const port = environment_config_1.SSL.IS_ACTIVE ? 443 : environment_config_1.PORT;
        const protocol = environment_config_1.SSL.IS_ACTIVE ? 'HTTPS' : 'HTTP';
        return this.server.listen(port, () => {
            logger_service_1.Logger.log('info', `${protocol} server is now running on port ${port} (${environment_config_1.ENV})`);
        });
    }
}
exports.ServerConfiguration = ServerConfiguration;
const Server = ServerConfiguration.get();
exports.Server = Server;
