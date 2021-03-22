"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Catch = void 0;
const node_notifier_1 = require("node-notifier");
const logger_service_1 = require("@services/logger.service");
const error_factory_1 = require("@factories/error.factory");
/**
 * Error catch/output middleware
 *
 * @dependency libnotify-bin
 * @dependency node-notifier
 *
 * @see https://www.npmjs.com/package/node-notifier
 */
class Catch {
    constructor() { }
    /**
     * @description
     */
    static get() {
        if (!Catch.instance) {
            Catch.instance = new Catch();
        }
        return Catch.instance;
    }
    /**
     * @description Display error in desktop notification
     *
     * @param err Error object
     * @param req Express request object derived from http.incomingMessage
     * @param res Express response object
     * @param next Callback function
     *
     * @require libnotify-bin
     * @require node-notifier
     */
    notification(err, req, res, next) {
        node_notifier_1.notify({
            title: `Error in ${req.method} ${req.url}`,
            message: err.name + '\n' + err.stack ? err.stack : err.message
        });
        next(err, req, res, next);
    }
    /**
     * @description
     *
     * @param err
     * @param req
     * @param res
     * @param next
     */
    factory(err, req, res, next) {
        next(error_factory_1.ErrorFactory.get(err), req, res);
    }
    /**
     * @description Write errors in a log file
     *
     * @param err Error object
     * @param req Express request object derived from http.incomingMessage
     * @param res Express response object
     * @param next Callback function
     */
    log(err, req, res, next) {
        logger_service_1.Logger.log('error', `${req.headers['x-forwarded-for'] || req.connection.remoteAddress} HTTP/${req.httpVersion} ${err.statusCode} ${req.method} ${req.url} ${err.stack ? '\n' + err.stack : err.errors.slice().shift()}`);
        next(err, req, res);
    }
    /**
     * @description Display clean error for final user
     *
     * @param err Error object
     * @param req Express request object derived from http.incomingMessage
     * @param res Express response object
     */
    exit(err, req, res, next) {
        res.status(err.statusCode);
        res.json({ statusCode: err.statusCode, statusText: err.statusText, errors: err.errors });
    }
    /**
     * @description Display clean 404 error for final user
     *
     * @param req Express request object derived from http.incomingMessage
     * @param res Express response object
     */
    notFound(req, res) {
        res.status(404);
        res.json({ statusCode: 404, statusText: 'Ooops... end point was not found', errors: ['Looks like someone\'s gone mushroom picking\''] });
    }
}
const catcher = Catch.get();
exports.Catch = catcher;
