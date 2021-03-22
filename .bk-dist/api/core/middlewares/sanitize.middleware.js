"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sanitize = void 0;
const environment_config_1 = require("@config/environment.config");
const _enums_1 = require("@enums");
const sanitizer_service_1 = require("@services/sanitizer.service");
/**
 * @description
 */
class Sanitize {
    constructor() { }
    /**
     * @description
     */
    static get() {
        if (!Sanitize.instance) {
            Sanitize.instance = new Sanitize();
        }
        return Sanitize.instance;
    }
    /**
     * @description Clean current data before output if the context requires it
     *
     * @param req Express Request instance
     * @param res Express Response instance
     * @param next Callback function
     */
    async sanitize(req, res, next) {
        const hasContent = typeof res.locals.data !== 'undefined';
        if (req.method === 'DELETE' || environment_config_1.CONTENT_TYPE !== _enums_1.CONTENT_TYPE['application/json'] || !hasContent) {
            return next();
        }
        if (!sanitizer_service_1.SanitizeService.hasEligibleMember(res.locals.data)) {
            return next();
        }
        res.locals.data = sanitizer_service_1.SanitizeService.process(res.locals.data);
        next();
    }
}
const sanitize = Sanitize.get();
exports.Sanitize = sanitize;
