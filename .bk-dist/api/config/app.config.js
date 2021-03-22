"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = exports.ExpressConfiguration = void 0;
const Express = require("express");
const Hpp = require("hpp");
const BodyParser = require("body-parser");
const Cors = require("cors");
const Compression = require("compression");
const RateLimit = require("express-rate-limit");
const Helmet = require("helmet");
const boom_1 = require("@hapi/boom");
const _enums_1 = require("@enums");
const environment_config_1 = require("@config/environment.config");
const authentication_config_1 = require("@config/authentication.config");
const logger_config_1 = require("@config/logger.config");
const proxy_router_service_1 = require("@services/proxy-router.service");
const cors_middleware_1 = require("@middlewares/cors.middleware");
const resolve_middleware_1 = require("@middlewares/resolve.middleware");
const catch_middleware_1 = require("@middlewares/catch.middleware");
const sanitize_middleware_1 = require("@middlewares/sanitize.middleware");
const cache_middleware_1 = require("@middlewares/cache.middleware");
/**
 * Instanciate and set Express application.
 * Configure and plug middlewares from local options or dedicated files in ./config
 */
class ExpressConfiguration {
    constructor() {
        /**
         * @description Middlewares options
         */
        this.options = {
            cors: {
                origin: (origin, callback) => {
                    if (environment_config_1.AUTHORIZED.indexOf(origin) !== -1) {
                        callback(null, true);
                    }
                    else {
                        callback(boom_1.notAcceptable('Domain not allowed by CORS'));
                    }
                },
                methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                allowedHeaders: ['Accept', 'Content-Type', 'Authorization', 'Origin', 'From']
            },
            helmet: {
                contentSecurityPolicy: {
                    defaultSrc: ['\'self\'', `'${environment_config_1.DOMAIN}'`],
                    scriptSrc: ['\'self\'', '\'unsafe-inline\''],
                    sandbox: ['allow-forms', 'allow-scripts'],
                    reportUri: '/report-violation',
                    objectSrc: ['\'none\''],
                    upgradeInsecureRequests: true,
                    workerSrc: false // This is not set.
                },
                hidePoweredBy: true,
                noSniff: true,
                referrerPolicy: { policy: 'no-referrer' }
            },
            rate: {
                windowMs: 60 * 60 * 1000,
                max: 2500,
                message: 'Too many requests from this IP, please try again after an hour'
            }
        };
    }
    /**
     * @description Instantiate Express configuration
     */
    static get() {
        if (!ExpressConfiguration.instance) {
            ExpressConfiguration.instance = new ExpressConfiguration();
        }
        return ExpressConfiguration.instance;
    }
    /**
     * @description
     */
    init() {
        if (!this.application) {
            this.application = Express();
        }
        return this;
    }
    /**
     * @description Plug middlewares
     */
    plug() {
        /**
         * Check headers validity
         */
        this.application.use(cors_middleware_1.Cors.validate);
        /**
         * Expose body on req.body
         *
         * @see https://www.npmjs.com/package/body-parser
         */
        this.application.use(BodyParser.urlencoded({ extended: false }));
        this.application.use(BodyParser.json({ type: environment_config_1.CONTENT_TYPE }));
        /**
         * Prevent request parameter pollution
         *
         * @see https://www.npmjs.com/package/hpp
         */
        this.application.use(Hpp({ checkBody: false }));
        /**
         * GZIP compression
         *
         * @see https://github.com/expressjs/compression
         */
        this.application.use(Compression());
        /**
         * Enable and set Helmet security middleware
         *
         * @see https://github.com/helmetjs/helmet
         */
        Object.keys(this.options.helmet).forEach(key => {
            this.application.use(typeof this.options.helmet[key] === 'boolean' && this.options.helmet[key] ? Helmet[key]() : Helmet[key](this.options.helmet[key]));
        });
        /**
         * Enable CORS - Cross Origin Resource Sharing
         *
         * @see https://www.npmjs.com/package/cors
         */
        this.application.use(Cors(this.options.cors));
        /**
         * Initialize Passport
         *
         * @see http://www.passportjs.org/
         */
        this.application.use(authentication_config_1.Authentication.initialize());
        /**
         * Plug available auth providers
         */
        authentication_config_1.Authentication.plug();
        /**
         * Configure API Rate limit
         * You can also set limit on specific route path
         *
         * @see https://www.npmjs.com/package/express-rate-limit
         */
        this.application.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
        /**
         * Request logging with Winston and Morgan
         *
         * @see https://github.com/winstonjs/winston
         * @see https://github.com/expressjs/morgan
         */
        this.application.use(logger_config_1.LoggerConfiguration.writeStream());
        /**
         * Define CDN location for static resources
         */
        this.application.use('/cdn', RateLimit(this.options.rate), Express.static(`${__dirname}/../../${environment_config_1.UPLOAD.PATH}`));
        /**
         * Lifecyle of a classic request
         *
         * - RateLimit
         * - Memory cache
         * - Router(s)
         * - Sanitizer
         * - Resolver
         */
        this.application.use(`/api/${environment_config_1.API_VERSION}`, RateLimit(this.options.rate), cache_middleware_1.Cache.read, proxy_router_service_1.ProxyRouter.map(), sanitize_middleware_1.Sanitize.sanitize, resolve_middleware_1.Resolve.write);
        /**
         * Desktop error notification
         */
        if ([_enums_1.ENVIRONMENT.development].includes(environment_config_1.ENV)) {
            this.application.use(catch_middleware_1.Catch.notification);
        }
        /**
         * Lifecycle of an error request
         *
         * - Generate typed error
         * - Log dirty error
         * - Output clean HTTP friendly error
         * - Output clean 404 error
         */
        this.application.use(catch_middleware_1.Catch.factory, catch_middleware_1.Catch.log, catch_middleware_1.Catch.exit, catch_middleware_1.Catch.notFound);
        return this;
    }
}
exports.ExpressConfiguration = ExpressConfiguration;
const Application = ExpressConfiguration
    .get()
    .init()
    .plug()
    .application;
exports.Application = Application;
