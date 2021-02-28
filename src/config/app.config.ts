import { ENVIRONMENT } from '@enums/environment.enum';
import { httpLogs, authorized, version, env, contentType } from "@config/environment.config";

import * as Express from "express";
import * as Hpp from "hpp";
import * as BodyParser from "body-parser";
import * as Cors from "cors";
import * as Compression from "compression";
import * as RateLimit from "express-rate-limit";
import * as Morgan from "morgan";

import { createWriteStream } from "fs";
import { initialize as PassportInitialize, use as PassportUse } from "passport";
import { notAcceptable } from "boom";

import { Container } from "@config/container.config";

import { HelmetConfiguration } from "@config/helmet.config";
import { PassportConfiguration } from "@config/passport.config";

import { Header } from "@middlewares/header.middleware";
import { Serializer } from "@middlewares/serializer.middleware";
import { Resolver } from "@middlewares/resolver.middleware";
import { Catcher } from "@middlewares/catcher.middleware";

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
      origin: (origin, callback) => {
        if (authorized.indexOf(origin) !== -1) { callback(null, true); }
        else { callback( notAcceptable('Domain not allowed by CORS') ); }
      },
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Accept", "Content-Type", "Authorization", "Origin", "From"]
    },
    stream: env === ENVIRONMENT.production ? createWriteStream(`${process.cwd()}/dist/logs/access.log`, { flags: 'a+' }) : Container.resolve('Logger').get('stream'),
    rate: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 2500,
      message: "Too many requests from this IP, please try again after an hour"
    }
  };

  constructor(app: Express.Application) {

    this.instance = app;

    /**
     * First, before all : check headers validity 
     *
     */
    this.instance.use( Header.check({ contentType }) );

    /**
     * Expose body on req.body
     * 
     * @see https://www.npmjs.com/package/body-parser
     */
    this.instance.use( BodyParser.urlencoded({ extended : false }) );
    this.instance.use( BodyParser.json({ type: contentType }) );

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
    this.instance.use( HelmetConfiguration.get()() );

    /**
     * Enable CORS - Cross Origin Resource Sharing
     *
     * @see https://www.npmjs.com/package/cors
     */
    this.instance.use( Cors( this.options.cors ) );

    /**
     * Passport configuration
     * 
     * @see http://www.passportjs.org/
     */
    this.instance.use( PassportInitialize() );

    PassportUse('jwt', PassportConfiguration.factory('jwt'));
    PassportUse('facebook', PassportConfiguration.factory('facebook'));
    PassportUse('google', PassportConfiguration.factory('google'));

    /**
     * Request logging with Morgan
     * dev : console | production : file
     * 
     * @see https://github.com/expressjs/morgan
     */
    this.instance.use( Morgan(httpLogs, { stream: this.options.stream }) );

    /**
     * Configure API Rate limit
     * Note that you can also set limit on specific route path
     * 
     * @see https://www.npmjs.com/package/express-rate-limit
     */
    this.instance.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    
    /**
     * Set global middlewares on Express Application
     * 
     * Note that after router, and before resolver, some routes pass by the Serializer middleware
     * See services/proxy-router.service.ts to check which route serializes her data before exiting
     * 
     * Note also that middlewares are implemented in each route file (Guard, Validation, Upload, ...)
     * 
     * - RateLimit
     * - Deserializer (if Content-Type is application/vnd.api+json)
     * - Router(s)
     * - Resolver
     */
    this.instance.use(`/api/${version}`, RateLimit(this.options.rate), Serializer.deserialize, Container.resolve('ProxyRouter').router, Resolver.resolve);

    /**
     * Errors handlers
     */
    if( [ENVIRONMENT.development].includes(env as ENVIRONMENT) ) {
      this.instance.use( Catcher.notification ); // Notify in dev
    } 

    this.instance.use( Catcher.log, Catcher.exit, Catcher.notFound ); // Log, exit with error || exit with 404
  }

  /**
   * @description Instantiate Express application
   */
  get(): Express.Application {
    return this.instance;
  }
} 