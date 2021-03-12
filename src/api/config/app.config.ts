import * as Express from 'express';
import * as Hpp from 'hpp';
import * as BodyParser from 'body-parser';
import * as Cors from 'cors';
import * as Compression from 'compression';
import * as RateLimit from 'express-rate-limit';
import * as Morgan from 'morgan';
import * as Helmet from 'helmet';

import { createWriteStream } from 'fs';
import { initialize as Passport } from 'passport';
import { notAcceptable } from '@hapi/boom';

import { ENVIRONMENT } from '@enums/environment.enum';

import { API_VERSION, AUTHORIZED, CONTENT_TYPE, DOMAIN, LOGS, ENV, UPLOAD } from '@config/environment.config';
import { PassportConfiguration } from '@config/passport.config';

import { Logger } from '@services/logger.service';
import { ProxyRouter } from '@services/proxy-router.service';

import { Cors as Kors } from '@middlewares/cors.middleware';
import { Resolver } from '@middlewares/resolver.middleware';
import { Catcher } from '@middlewares/catcher.middleware';
import { Sanitizer } from '@middlewares/sanitizer.middleware';
import { Kache } from '@middlewares/cache.middleware';

/**
 * Instanciate and set Express application.
 * Configure and plug middlewares from local options or dedicated files in ./config.
 */
export class ExpressConfiguration {

  /**
   * @description Wrapped Express.js application
   */
  private instance: Express.Application;


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
    stream: (ENV === ENVIRONMENT.production ? createWriteStream(`${LOGS.PATH}/access.log`, { flags: 'a+' }) : Logger.stream ) as ReadableStream,
    rate: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 2500,
      message: 'Too many requests from this IP, please try again after an hour'
    }
  };

  constructor(app: Express.Application) {

    this.instance = app;

    /**
     * First, before all : check headers validity
     */
    this.instance.use( Kors(CONTENT_TYPE) );

    /**
     * Expose body on req.body
     *
     * @see https://www.npmjs.com/package/body-parser
     */
    this.instance.use( BodyParser.urlencoded({ extended : false }) );
    this.instance.use( BodyParser.json({ type: CONTENT_TYPE }) );

    /**
     * Prevent request parameter pollution
     *
     * @see https://www.npmjs.com/package/hpp
     */
    this.instance.use( Hpp({ checkBody: false }) );

    /**
     * GZIP compression
     *
     * @see https://github.com/expressjs/compression
     */
    this.instance.use( Compression() );

    /**
     * Enable and set Helmet security middleware
     *
     * @see https://github.com/helmetjs/helmet
     */
     Object.keys(this.options.helmet).forEach( key => {
      this.instance.use( typeof this.options.helmet[key] === 'boolean' && this.options.helmet[key] ? Helmet[key]() : Helmet[key](this.options.helmet[key]) )
    });

    /**
     * Enable CORS - Cross Origin Resource Sharing
     *
     * @see https://www.npmjs.com/package/cors
     */
    this.instance.use( Cors( this.options.cors ) );

    /**
     * Passport initialize
     *
     * @see http://www.passportjs.org/
     */
    this.instance.use( Passport() );

    /**
     * Plug active oAuth provider
     */
    PassportConfiguration.plug()

    /**
     * Configure API Rate limit
     * Note that you can also set limit on specific route path
     *
     * @see https://www.npmjs.com/package/express-rate-limit
     */
    this.instance.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

    /**
     * Request logging with Morgan
     *
     * @see https://github.com/expressjs/morgan
     */
    this.instance.use( Morgan(LOGS.TOKEN, { stream: this.options.stream } ) );

    /**
     * Define CDN static resources location
     */
    this.instance.use('/cdn', RateLimit(this.options.rate), Express.static(`${__dirname}/../../${UPLOAD.PATH}`));

    /**
     * Set global middlewares on Express Application
     *
     * - RateLimit
     * - Memory cache
     * - Router(s)
     * - Resolver
     */
    this.instance.use(`/api/${API_VERSION}`, RateLimit(this.options.rate), Kache, ProxyRouter.map(), Sanitizer, Resolver);

    /**
     * Errors handlers
     */
    if( [ENVIRONMENT.development].includes(ENV as ENVIRONMENT) ) {
      this.instance.use( Catcher.notification );
    }

    this.instance.use( Catcher.factory, Catcher.log, Catcher.exit, Catcher.notFound ); // Factorize error, log it, exit with clean HTTP error | clean 404
  }

  /**
   * @description Instantiate Express application
   */
  get(): Express.Application {
    return this.instance;
  }
}