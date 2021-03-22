"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guard = void 0;
const passport_1 = require("passport");
const es6_promisify_1 = require("es6-promisify");
const boom_1 = require("@hapi/boom");
const _enums_1 = require("@enums");
const enum_util_1 = require("@utils/enum.util");
/**
 * @description
 */
class Guard {
    constructor() {
        /**
         * @description Callback function provided to passport.authenticate with JWT strategy
         *
         * @param req Express request object derived from http.incomingMessage
         * @param res Express response object
         * @param next Callback function
         * @param roles Authorized roles
         */
        this.handleJWT = (req, res, next, roles) => async (err, user, info) => {
            const error = err || info;
            const logIn = es6_promisify_1.promisify(req.logIn);
            try {
                if (error || !user)
                    throw error;
                await logIn(user, { session: false });
            }
            catch (e) {
                return next(boom_1.forbidden(e));
            }
            if (!roles.includes(user.role)) {
                return next(boom_1.forbidden('Forbidden area'));
            }
            else if (user.role !== _enums_1.ROLE.admin && parseInt(req.params.userId, 10) !== user.id) {
                return next(boom_1.forbidden('Forbidden area'));
            }
            req.user = user;
            return next();
        };
        /**
         * @description
         *
         * @param req
         * @param res
         * @param nex
         */
        this.handleOauth = (req, res, next) => async (err, user) => {
            if (err) {
                return next(boom_1.badRequest(err?.message));
            }
            else if (!user) {
                return next(boom_1.notFound(err?.message));
            }
            else if (!enum_util_1.list(_enums_1.ROLE).includes(user.role)) {
                return next(boom_1.forbidden('Forbidden area'));
            }
            req.user = user;
            next();
        };
        /**
         * @description
         *
         * @param req
         * @param res
         * @param next
         * @param roles Authorized roles
         * @param cb
         *
         * @dependency passport
         * @see http://www.passportjs.org/
         */
        this.authentify = (req, res, next, roles, callback) => passport_1.authenticate('jwt', { session: false }, callback(req, res, next, roles))(req, res, next);
        /**
         * @description
         *
         * @param req
         * @param res
         * @param next
         * @param service jwt | oAuth service provider
         * @param cb
         *
         * @dependency passport
         * @see http://www.passportjs.org/
         */
        this.oAuthentify = (req, res, next, service, callback) => passport_1.authenticate(service, { session: false }, callback(req, res, next))(req, res, next);
        /**
         * @description Authorize user access according to role(s) in arguments
         *
         * @param roles
         */
        this.authorize = (roles) => (req, res, next) => this.authentify(req, res, next, roles, this.handleJWT);
        /**
         * @description Authorize user access according to external service access_token
         *
         * @param service OAuthProvider
         */
        this.oAuth = (service) => passport_1.authenticate(service, { session: false });
        /**
         * @description Authorize user access according to API rules
         *
         * @param service OAuthProvider
         */
        this.oAuthCallback = (service) => (req, res, next) => this.oAuthentify(req, res, next, service, this.handleOauth);
    }
    /**
     * @description
     */
    static get() {
        if (!Guard.instance) {
            Guard.instance = new Guard();
        }
        return Guard.instance;
    }
}
const guard = Guard.get();
exports.Guard = guard;
