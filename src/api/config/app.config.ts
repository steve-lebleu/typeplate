import * as Express from 'express';
import * as Hpp from 'hpp';
import * as BodyParser from 'body-parser';
import * as Cors from 'cors';
import * as Compression from 'compression';
import * as RateLimit from 'express-rate-limit';
import * as Helmet from 'helmet';

import { notAcceptable } from '@hapi/boom';

import { ENVIRONMENT } from '@enums/environment.enum';

import { API_VERSION, AUTHORIZED, CONTENT_TYPE, DOMAIN, ENV, UPLOAD } from '@config/environment.config';

import { Authentication } from '@config/authentication.config';
import { LoggerConfiguration } from '@config/logger.config';

import { ProxyRouter } from '@services/proxy-router.service';

import { Cors as Kors } from '@middlewares/cors.middleware';
import { Resolve } from '@middlewares/resolve.middleware';
import { Catch } from '@middlewares/catch.middleware';
import { Sanitize } from '@middlewares/sanitize.middleware';
import { Cache } from '@middlewares/cache.middleware';

/**
 * Instanciate and set Express application.
 * Configure and plug middlewares from local options or dedicated files in ./config
 */
export class ExpressConfiguration {

  /**
   * @description Wrapped Express.js application
   */
  private static instance: ExpressConfiguration;

  /**
   * @description Express application
   */
  application: Express.Application;

  /**
   * @description Middlewares options
   */
  private options = {
    cors: {
      origin: (origin, callback: ( error: Error, status?: boolean ) => void) => {
        if (AUTHORIZED.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback( notAcceptable('Domain not allowed by CORS') );
        }
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Accept', 'Content-Type', 'Authorization', 'Origin', 'From']
    },
    helmet: {
      contentSecurityPolicy: {
        defaultSrc: ['\'self\'', `'${DOMAIN}'`],
        scriptSrc: ['\'self\'', '\'unsafe-inline\''],
        sandbox: ['allow-forms', 'allow-scripts'],
        reportUri: '/report-violation',
        objectSrc: ['\'none\''],
        upgradeInsecureRequests: true,
        workerSrc: false  // This is not set.
      },
      hidePoweredBy: true,
      noSniff: true,
      referrerPolicy: { policy: 'no-referrer' }
    },
    rate: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 2500,
      message: 'Too many requests from this IP, please try again after an hour'
    }
  };

  private constructor() {}

  /**
   * @description Instantiate Express configuration
   */
  static get(): ExpressConfiguration {
    if (!ExpressConfiguration.instance) {
      ExpressConfiguration.instance = new ExpressConfiguration();
    }
    return ExpressConfiguration.instance;
  }

  /**
   * @description
   */
  init(): ExpressConfiguration {
    if (!this.application) {
      this.application = Express();
    }
    return this;
  }

  /**
   * @description Plug middlewares
   */
  plug(): ExpressConfiguration {

    /**
     * Check headers validity
     */
    this.application.use( Kors.validate );

    /**
     * Expose body on req.body
     *
     * @see https://www.npmjs.com/package/body-parser
     */
    this.application.use( BodyParser.urlencoded({ extended : false }) );
    this.application.use( BodyParser.json({ type: CONTENT_TYPE }) );

    /**
     * Prevent request parameter pollution
     *
     * @see https://www.npmjs.com/package/hpp
     */
    this.application.use( Hpp({ checkBody: false }) );

    /**
     * GZIP compression
     *
     * @see https://github.com/expressjs/compression
     */
    this.application.use( Compression() );

    /**
     * Enable and set Helmet security middleware
     *
     * @see https://github.com/helmetjs/helmet
     */
     Object.keys(this.options.helmet).forEach( key => {
      this.application.use( typeof this.options.helmet[key] === 'boolean' && this.options.helmet[key] ? Helmet[key]() : Helmet[key](this.options.helmet[key]) )
    });

    /**
     * Enable CORS - Cross Origin Resource Sharing
     *
     * @see https://www.npmjs.com/package/cors
     */
    this.application.use( Cors( this.options.cors ) );

    /**
     * Initialize Passport
     *
     * @see http://www.passportjs.org/
     */
    this.application.use( Authentication.initialize() );

    /**
     * Plug available auth providers
     */
     Authentication.plug();

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
    this.application.use( LoggerConfiguration.writeStream() as any );

    /**
     * Lifecyle of a classic request
     *
     * - RateLimit
     * - Memory cache
     * - Router(s)
     * - Sanitizer
     * - Resolver
     */
    this.application.use(`/api/${API_VERSION}`, RateLimit(this.options.rate), Cache.read, ProxyRouter.map(), Sanitize.sanitize, Resolve.write);

    /**
     * Desktop error notification
     */
    if( [ENVIRONMENT.development].includes(ENV as ENVIRONMENT) ) {
      this.application.use( Catch.notification );
    }

    /**
     * Lifecycle of an error request
     *
     * - Generate typed error
     * - Log dirty error
     * - Output clean HTTP friendly error
     * - Output clean 404 error
     */
    this.application.use( Catch.factory, Catch.log, Catch.exit, Catch.notFound );

    return this;
  }
}

const Application = ExpressConfiguration
  .get()
  .init()
  .plug()
  .application;

export { Application }