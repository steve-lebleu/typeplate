"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainController = void 0;
const logger_service_1 = require("@services/logger.service");
/**
 * Manage incoming requests from api/{version}/.
 * End points of this router resolve response by itself.
 */
class MainController {
    constructor() { }
    /**
     * @description
     */
    static get() {
        if (!MainController.instance) {
            MainController.instance = new MainController();
        }
        return MainController.instance;
    }
    /**
     * @description Ping api
     *
     * @param req Express request object derived from http.incomingMessage
     * @param res Express response object
     */
    async status(req, res, next) {
        res.status(200);
        res.end();
    }
    /**
     * @description Log CSP report violation. This endpoint is called programmaticaly by helmet.
     *
     * @param req Express request object derived from http.incomingMessage
     * @param res Express response object
     */
    async report(req, res, next) {
        logger_service_1.Logger.log('error', req.body ? `CSP Violation: ${JSON.stringify(req.body)}` : 'CSP Violation');
        res.status(204);
        res.end();
    }
}
const mainController = MainController.get();
exports.MainController = mainController;
