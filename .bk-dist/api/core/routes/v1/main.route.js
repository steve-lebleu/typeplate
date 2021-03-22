"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainRouter = void 0;
const _classes_1 = require("@classes");
const main_controller_1 = require("@controllers/main.controller");
class MainRouter extends _classes_1.Router {
    constructor() {
        super();
    }
    /**
     * @description Plug routes definitions
     */
    define() {
        /**
         * @api {get} /status Ping API
         * @apiDescription Check API availability
         * @apiVersion 1.0.0
         * @apiName Status
         * @apiGroup Info
         * @apiPermission public
         *
         * @apiHeader {String="application/json"} Content-Type   Mime-type
    
         *
         * @apiHeaderExample {json} Request headers
         * {
         *    "Content-Type": "application/json",
         *    "Origin": "https://your-host.com"
         * }
         *
         * @apiSuccess (Ok 200) {String} OK string success
         *
         * @apiError (Not acceptable 406) Content-Type Must be application/json or multipart-form/data
         * @apiError (Not acceptable 406) Origin Should be specified
         * @apiError (Internal server error 500) Internal API is down
         */
        this.router.route('/status').get(main_controller_1.MainController.status);
        /**
         * @ {post} /report-violation Log CSP
         *
         * @Description Log security policy violation.
         * @Version 1.0.0
         * @Name CSPViolationReport
         * @Group Info
         * @Permission public
         *
         * @Success (Success 200) Report successfully logged
         *
         * @Error (Internal server error 500) Internal server error while logging
         */
        this.router.route('/report-violation').post(main_controller_1.MainController.report);
    }
}
exports.MainRouter = MainRouter;
