"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cors = void 0;
const boom_1 = require("@hapi/boom");
const environment_config_1 = require("@config/environment.config");
const _enums_1 = require("@enums");
/**
 * @description
 */
class Cors {
    constructor() { }
    /**
     * @description
     */
    static get() {
        if (!Cors.instance) {
            Cors.instance = new Cors();
        }
        return Cors.instance;
    }
    /**
     * @description Check header validity according to current request and current configuration requirements
     *
     * @param contentType Configuration content-type
     *
     * @param req Express request object derived from http.incomingMessage
     * @param res Express response object
     * @param next Callback function
     */
    validate(req, res, next) {
        if (!req.headers['content-type']) {
            return next(boom_1.notAcceptable(`Content-Type headers must be ${environment_config_1.CONTENT_TYPE} or 'multipart/form-data', ${req.headers['content-type']} given`));
        }
        if (_enums_1.CONTENT_TYPE[environment_config_1.CONTENT_TYPE] !== req.headers['content-type'] && req.headers['content-type'].lastIndexOf(_enums_1.CONTENT_TYPE['multipart/form-data']) === -1) {
            return next(boom_1.notAcceptable(`Content-Type head must be ${environment_config_1.CONTENT_TYPE} or 'multipart/form-data, ${req.headers['content-type']} given`));
        }
        if (!req.headers.origin) {
            return next(boom_1.notAcceptable('Origin header must be specified'));
        }
        next();
    }
}
const cors = Cors.get();
exports.Cors = cors;
