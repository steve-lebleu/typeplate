import { existsSync, mkdirSync } from 'fs';

import { config as Dotenv } from 'dotenv';

import { DatabaseEngine, MomentUnit, EnvAccessToken, EnvOauth, EnvMemoryCache, EnvSSL, EnvTypeorm, EnvLog, EnvUpload, EnvImageScaling, EnvRefreshToken } from '@types';
import { DATABASE_ENGINE, ENVIRONMENT, ARCHIVE_MIME_TYPE, AUDIO_MIME_TYPE, DOCUMENT_MIME_TYPE, IMAGE_MIME_TYPE, VIDEO_MIME_TYPE, CONTENT_TYPE as CONTENT_TYPE_ENUM } from '@enums';

import { list } from '@utils/enum.util';

/**
 *
 * @dependency dotenv
 *
 * @see https://www.npmjs.com/package/dotenv
 *
 */
export class Environment {

  /**
   * @description Environment instance
   */
  private static instance: Environment;

  /**
   * @description Current root dir
   */
  base = 'dist';

  /**
   * @description Cluster with aggregated data
   */
  cluster: Record<string,unknown>;

  /**
   * @description Current environment
   */
  environment: string = ENVIRONMENT.development;

  /**
   * @description Errors staged on current environment
   */
  errors: string[] = [];

  /**
   * @description Env variables
   */
  variables: Record<string,unknown>;

  /**
   * @description Files directories
   */
  readonly dirs: string[] = [
    'archives',
    'documents',
    'images',
    'images/master-copy',
    'images/rescale',
    'audios',
    'videos'
  ];

  private constructor() {}

  /**
   * @description Environment singleton getter
   */
  static get(): Environment {
    if (!Environment.instance) {
      Environment.instance = new Environment();
    }
    return Environment.instance;
  }

  /**
   * @description Env variables exhaustive key list
   */
  get keys(): string[] {
    return [
      'ACCESS_TOKEN_SECRET',
      'ACCESS_TOKEN_DURATION',
      'API_VERSION',
      'AUTHORIZED',
      'CDN',
      'CONTENT_TYPE',
      'DOMAIN',
      'FACEBOOK_CONSUMER_ID',
      'FACEBOOK_CONSUMER_SECRET',
      'GITHUB_CONSUMER_ID',
      'GITHUB_CONSUMER_SECRET',
      'GOOGLE_CONSUMER_ID',
      'GOOGLE_CONSUMER_SECRET',
      'LINKEDIN_CONSUMER_ID',
      'LINKEDIN_CONSUMER_SECRET',
      'LOGS_PATH',
      'LOGS_TOKEN',
      'MEMORY_CACHE',
      'MEMORY_CACHE_DURATION',
      'PORT',
      'REFRESH_TOKEN_DURATION',
      'REFRESH_TOKEN_SECRET',
      'REFRESH_TOKEN_UNIT',
      'RESIZE_IS_ACTIVE',
      'RESIZE_PATH_MASTER',
      'RESIZE_PATH_SCALE',
      'RESIZE_SIZE_LG',
      'RESIZE_SIZE_MD',
      'RESIZE_SIZE_SM',
      'RESIZE_SIZE_XL',
      'RESIZE_SIZE_XS',
      'SSL_CERT',
      'SSL_KEY',
      'TYPEORM_DB',
      'TYPEORM_CACHE',
      'TYPEORM_CACHE_DURATION',
      'TYPEORM_HOST',
      'TYPEORM_LOG',
      'TYPEORM_NAME',
      'TYPEORM_PORT',
      'TYPEORM_PWD',
      'TYPEORM_SYNC',
      'TYPEORM_TYPE',
      'TYPEORM_USER',
      'UPLOAD_MAX_FILE_SIZE',
      'UPLOAD_MAX_FILES',
      'UPLOAD_PATH',
      'UPLOAD_WILDCARDS',
      'URL'
    ]
  }

  /**
   * @description Embeded validation rules for env variables
   */
  get rules(): Record<string,any> {

    return {

      /**
       * @description Access token secret phrase
       */
      ACCESS_TOKEN_SECRET: (value: string): string => {
        if (!value) {
          this.errors.push('ACCESS_TOKEN_SECRET not found: please fill an access token secret value in your .env file to strengthen the encryption.');
        }
        if (value && value.toString().length < 32) {
          this.errors.push('ACCESS_TOKEN_SECRET bad value: please fill an access token secret which have a length >= 32.');
        }
        return value ? value.toString() : null;
      },

      /**
       * @description Access token duration in minutes
       *
       * @default 60
       */
      ACCESS_TOKEN_DURATION: (value: string): number => {
        if (value && isNaN( parseInt(value, 10) )) {
          this.errors.push('ACCESS_TOKEN_DURATION bad value: please fill a duration expressed as a number');
        }
        return parseInt(value, 10) || 60;
      },

      /**
       * @description Current api version
       *
       * @default v1
       */
      API_VERSION: (value: string): string => {
        return value ? value.trim().toLowerCase() : 'v1';
      },

      /**
       * @description Authorized remote(s) host(s)
       *
       * @default null
       */
      AUTHORIZED: (value: string): string => {
        const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}(:[0-9]{1,5})|\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
        if (!value) {
          this.errors.push('AUTHORIZED not found: please fill a single host as string or multiple hosts separated by coma (ie: http://my-domain.com or http://my-domain-1.com,http://my-domain-2.com, ...');
        }
        if ( value && value.lastIndexOf(',') === -1 && !regex.test(value)) {
          this.errors.push('AUTHORIZED bad value: please fill a single host as string or multiple hosts separated by coma (ie: http://my-domain.com or http://my-domain-1.com,http://my-domain-2.com, ...');
        }
        if ( value && value.lastIndexOf(',') !== -1 && value.split(',').some(v => !regex.test(v) )) {
          this.errors.push('AUTHORIZED bad value: please fill a single host as string or multiple hosts separated by coma (ie: http://my-domain.com or http://my-domain-1.com,http://my-domain-2.com, ...');
        }
        return value ? value.trim().toLowerCase() : null;
      },

      /**
       * @description Content delivery network location
       *
       * @default null
       */
      CDN: (value: string) => {
        const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}(:[0-9]{1,5})|\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
        if (value && regex.test(value) === false) {
          this.errors.push('CDN bad value: please fill a valid CDN url');
        }
        return value || null;
      },

      /**
       * @description Content-Type
       *
       * @default application/json
       */
      CONTENT_TYPE: (value: string) => {
        if (value && !CONTENT_TYPE_ENUM[value]) {
          this.errors.push(`CONTENT_TYPE bad value: please fill a supported Content-Type must be one of ${list(CONTENT_TYPE_ENUM).join(',')}`);
        }
        return value || CONTENT_TYPE_ENUM['application/json'];
      },

      /**
       * @description Domain of the application in current environment
       *
       * @default localhost
       */
      DOMAIN: (value: string): string => {
        return value ? value.trim().toLowerCase() : 'localhost';
      },

      /**
       * @description Facebook application id
       *
       * @default null
       */
      FACEBOOK_CONSUMER_ID: (value: string): string => {
        if (value && /[0-9]{15}/.test(value) === false) {
          this.errors.push('FACEBOOK_CONSUMER_ID bad value: check your Facebook app settings to fill a correct value.');
        }
        return value || null;
      },

      /**
       * @description Facebook application secret
       *
       * @default null
       */
      FACEBOOK_CONSUMER_SECRET: (value: string): string => {
        if (value && /[0-9-abcdef]{32}/.test(value) === false) {
          this.errors.push('FACEBOOK_CONSUMER_SECRET bad value: check your Facebook app settings to fill a correct value.')
        }
        return value || null;
      },

      /**
       * @description Github application id
       *
       * @default null
       */
      GITHUB_CONSUMER_ID: (value: string): string => {
        if (value && /[0-9-a-z-A-Z]{20}/.test(value) === false) {
          this.errors.push('GITHUB_CONSUMER_ID bad value: check your Github app settings to fill a correct value.');
        }
        return value || null;
      },

     /**
      * @description Github application secret
      *
      * @default null
      */
      GITHUB_CONSUMER_SECRET: (value: string): string => {
        if (value && /[0-9-A-Z-a-z-_]{40}/.test(value) === false) {
          this.errors.push('GITHUB_CONSUMER_SECRET bad value: check your Github app and fill a correct value in your .env file.')
        }
        return value || null;
      },

      /**
       * @description Google application id
       *
       * @default null
       */
      GOOGLE_CONSUMER_ID: (value: string): string => {
        if (value && /[0-9]{12}-[0-9-a-z]{32}.apps.googleusercontent.com/.test(value) === false) {
          this.errors.push('GOOGLE_CONSUMER_ID bad value: check your Google app settings to fill a correct value.');
        }
        return value || null;
      },

      /**
       * @description Google application secret
       *
       * @default null
       */
      GOOGLE_CONSUMER_SECRET: (value: string): string => {
        if (value && /[0-9-A-Z-a-z-_]{24}/.test(value) === false) {
          this.errors.push('GOOGLE_CONSUMER_SECRET bad value: check your Google app and fill a correct value in your .env file.')
        }
        return value || null;
      },

      /**
       * @description Linkedin application id
       *
       * @default null
       */
      LINKEDIN_CONSUMER_ID: (value: string): string => {
        if (value && /[0-9-a-z-A-Z]{20}/.test(value) === false) {
          this.errors.push('LINKEDIN_CONSUMER_ID bad value: check your Linkedin app settings to fill a correct value.');
        }
        return value || null;
      },

      /**
       * @description Linkedin application secret
       *
       * @default null
       */
      LINKEDIN_CONSUMER_SECRET: (value: string): string => {
        if (value && /[0-9-A-Z-a-z-_]{40}/.test(value) === false) {
          this.errors.push('LINKEDIN_CONSUMER_SECRET bad value: check your Linkedin app and fill a correct value in your .env file.')
        }
        return value || null;
      },

      /**
       * @description Logs token configuration used by Morgan for output pattern
       *
       * @default dev
       */
      LOGS_TOKEN: (value: string): string => {
        return this.environment === 'production' ? 'combined' : value || 'dev'
      },

      /**
       * @description Logs path root directory
       *
       * @default logs
       */
      LOGS_PATH: (value: string): string => {
        return `${process.cwd()}/${this.base}/${value || 'logs'}`
      },

      /**
       * @description Memory cache activated
       *
       * @default false
       */
      MEMORY_CACHE: (value: string): boolean => {
        return !!parseInt(value, 10) || false
      },

      /**
       * @description Memory cache lifetime duration
       *
       * @default 5000
       */
      MEMORY_CACHE_DURATION: (value: string): number => {
        return parseInt(value, 10) || 5000
      },

      /**
       * @description Listened port. Default 8101
       *
       * @default 8101
       */
      PORT: (value: string): number => {
        if (value && ( isNaN(parseInt(value,10)) || parseInt(value,10) > 65535)) {
          this.errors.push('PORT bad value: please fill a valid TCP port number');
        }
        return parseInt(value,10) || 8101;
      },

      /**
       * @description Refresh token duration
       *
       * @default 30
       */
      REFRESH_TOKEN_DURATION: (value: string): number => {
        if (value && isNaN(parseInt(value, 10))) {
          this.errors.push('REFRESH_TOKEN_DURATION bad value: duration must be a number expressed in minutes.');
        }
        return parseInt(value, 10) || 30;
      },

      /**
       * @description Refresh token secret phrase
       */
      REFRESH_TOKEN_SECRET: (value: string): string => {
        if (!value) {
          this.errors.push('REFRESH_TOKEN_SECRET not found: please fill a refresh token secret value in your .env file to strengthen the encryption.');
        }
        if (value && value.toString().length < 32) {
          this.errors.push('REFRESH_TOKEN_SECRET bad value: please fill a refresh token secret which have a length >= 32.');
        }
        return value ? value.toString() : null;
      },

      /**
       * @description Refresh token unit of duration (hours|days|weeks|months)
       *
       * @default 30
       */
      REFRESH_TOKEN_UNIT: (value: string): MomentUnit => {
        if(value && !['hours', 'days', 'weeks', 'months'].includes(value) ) {
          this.errors.push('REFRESH_TOKEN_UNIT bad value: unit must be one of hours, days, weeks, months.');
        }
        return (value || 'days') as MomentUnit
      },

      /**
       * @description Image resizing activated
       *
       * @default true
       */
      RESIZE_IS_ACTIVE: (value: string): boolean => {
        return !!parseInt(value, 10) || true
      },

      /**
       * @description Directory name for original copy (required)
       *
       * @default master-copy
       */
      RESIZE_PATH_MASTER: (value: string): string => {
        return value || 'master-copy'
      },

      /**
       * @description Directory name for resizes
       *
       * @default rescale
       */
      RESIZE_PATH_SCALE: (value: string): string => {
        return value || 'rescale'
      },

      /**
       * @description
       *
       * @default 1024
       */
      RESIZE_SIZE_LG: (value: string): number => {
        return parseInt(value, 10) || 1024
      },

      /**
       * @description
       *
       * @default 768
       */
      RESIZE_SIZE_MD: (value: string): number => {
        return parseInt(value, 10) || 768
      },

      /**
       * @description
       *
       * @default 320
       */
      RESIZE_SIZE_SM: (value: string): number => {
        return parseInt(value, 10) || 320
      },

      /**
       * @description
       *
       * @default 1366
       */
      RESIZE_SIZE_XL: (value: string): number => {
        return parseInt(value, 10) || 1366
      },

      /**
       * @description
       *
       * @default 280
       */
      RESIZE_SIZE_XS: (value: string): number => {
        return parseInt(value, 10) || 280
      },

      /**
       * @description SSL certificate location
       *
       * @default null
       */
      SSL_CERT: (value: string): string => {
        if (value && !existsSync(value)) {
          this.errors.push('SSL_CERT bad value or SSL certificate not found. Please check path and/or file access rights.')
        }
        return value || null
      },

      /**
       * @description SSL key location
       *
       * @default null
       */
      SSL_KEY: (value: string): string => {
        if (value && !existsSync(value)) {
          this.errors.push('SSL_KEY bad value or SSL key not found. Please check path and/or file access rights.')
        }
        return value || null
      },

      /**
       * @description
       *
       * @default null
       */
      TYPEORM_DB: (value: string): string => {
        if(!value) {
          this.errors.push('TYPEORM_DB not found: please define the targeted database.');
        }
        if (value && /^[0-9a-zA-Z_]{3,}$/.test(value) === false) {
          this.errors.push('TYPEORM_DB bad value: please check the name of your database according [0-9a-zA-Z_].');
        }
        return value || null
      },

      /**
       * @description
       *
       * @default false
       */
       TYPEORM_CACHE: (value: string): boolean => {
        if(value && isNaN(parseInt(value, 10))) {
          this.errors.push('TYPEORM_CACHE bad value: please use 0 or 1 to define activation of the db cache');
        }
        return !!parseInt(value, 10) || false
      },

      /**
       * @description
       *
       * @default 5000
       */
       TYPEORM_CACHE_DURATION: (value: string): number => {
        if(value && isNaN(parseInt(value,10))) {
          this.errors.push('TYPEORM_CACHE_DURATION bad value: please fill it with a duration expressed in ms.');
        }
        return parseInt(value,10) || 5000
      },

      /**
       * @description
       *
       * @default localhost
       */
      TYPEORM_HOST: (value: string): string => {
        if(!value) {
          this.errors.push('TYPEORM_HOST not found: please define the database server host.');
        }
        if(value && value !== 'localhost' && /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/.test(value) === false) {
          this.errors.push('TYPEORM_HOST bad value: please fill it with a valid database server host.');
        }
        return value || 'localhost'
      },

      /**
       * @description
       *
       * @default false
       */
      TYPEORM_LOG: (value: string): boolean => {
        return !!parseInt(value, 10) || false
      },

      /**
       * @description
       *
       * @default default
       */
      TYPEORM_NAME: (value: string): string => {
        return value || 'default'
      },

      /**
       * @description
       *
       * @default 3306
       */
      TYPEORM_PORT: (value: string): number => {
        if(!value) {
          this.errors.push('TYPEORM_PORT not found: please define the database server port.');
        }
        return parseInt(value,10) || 3306;
      },

      /**
       * @description
       *
       * @default null
       */
      TYPEORM_PWD: (value: string): string => {
        if(!value && ![ENVIRONMENT.test, ENVIRONMENT.development].includes(this.environment as ENVIRONMENT)) {
          this.errors.push('TYPEORM_PWD not found: please define the database user password.');
        }
        return value || null
      },

      /**
       * @description
       *
       * @default false
       */
      TYPEORM_SYNC: (value: string): boolean => {
        return this.environment === ENVIRONMENT.production ? false : this.environment === ENVIRONMENT.test ? true : !!parseInt(value, 10) || false
      },

      /**
       * @description
       *
       * @default mysql
       */
      TYPEORM_TYPE: (value: string): DatabaseEngine => {
        if(!value) {
          this.errors.push('TYPEORM_TYPE not found: please define the database engine type.');
        }
        if(value && !DATABASE_ENGINE[value]) {
          this.errors.push(`TYPEORM_TYPE bad value: database engine must be one of following: ${list(DATABASE_ENGINE).join(',')}.`);
        }
        return (value || 'mysql') as DatabaseEngine
      },

      /**
       * @description
       *
       * @default null
       */
      TYPEORM_USER: (value: string): string => {
        if(!value) {
          this.errors.push('TYPEORM_USER not found: please define one user for your database.');
        }
        return value || null
      },

      /**
       * @description Max upload file size
       *
       * @default 2000000
       */
      UPLOAD_MAX_FILE_SIZE: (value: string): number => {
        if(value && isNaN(parseInt(value, 10))) {
          this.errors.push('UPLOAD_MAX_FILE_SIZE bad value: please fill it with an integer.');
        }
        return parseInt(value, 10) || 2000000
      },

      /**
       * @description Max number of uploaded files by request
       *
       * @default 5
       */
      UPLOAD_MAX_FILES: (value: string): number => {
        if(value && isNaN(parseInt(value, 10))) {
          this.errors.push('UPLOAD_MAX_FILES bad value: please fill it with an integer.');
        }
        return parseInt(value, 10) || 5
      },

      /**
       * @description Upload directory path
       *
       * @default public
       */
      UPLOAD_PATH: (value: string): string => {
        return `${process.cwd()}/${this.base}/${value || 'public'}`
      },

      /**
       * @description Accepted mime-type
       *
       * @default AUDIO|ARCHIVE|DOCUMENT|IMAGE|VIDEO
       */
      UPLOAD_WILDCARDS: (value: string): string[] => {

        const mimes = { AUDIO: AUDIO_MIME_TYPE, ARCHIVE: ARCHIVE_MIME_TYPE, DOCUMENT: DOCUMENT_MIME_TYPE, IMAGE: IMAGE_MIME_TYPE, VIDEO: VIDEO_MIME_TYPE };
        const input = value ? value.toString().split(',') : Object.keys(mimes);
        const keys = Object.keys(mimes).map(k => k.toLowerCase());

        if (value && value.toString().split(',').some(key => !keys.includes(key)) ) {
          this.errors.push(`UPLOAD_WILDCARDS bad value: please fill it with an accepted value (${keys.join(',')}) with coma separation`);
        }

        return input
          .filter(key => mimes[key])
          .map(key => mimes[key] as Record<string,unknown> )
          .reduce((acc,current) => {
            return [...acc as string[], ...list(current)] as string[];
          }, []) as string[];
      },

      /**
       * @description API main URL
       *
       * @default http://localhost:8101
       */
      URL: (value: string): string => {
        const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}(\.[a-zA-Z0-9()]{1,})?(:[0-9]{1,5})?/;
        if (value && regex.test(value) === false) {
          this.errors.push('URL bad value. Please fill a local or remote URL');
        }
        return value || 'http://localhost:8101'
      }

    }
  }

  /**
   * @description Set env according to args, and load .env file
   */
  loads(nodeVersion: string): Environment {

    const [major, minor] = nodeVersion.split('.').map( parseFloat )

    if(major < 14  || major === 14 && minor < 16) {
      this.exit('The node version of the server is too low. Please consider at least v14.16.0.');
    }

    if ( ( process.argv && process.argv.indexOf('--env') !== -1 ) ) {
      this.environment = ENVIRONMENT[process.argv[process.argv.indexOf('--env') + 1]] as string || ENVIRONMENT.development;
    } else if ( process.env.RUNNER ) {
      this.environment = ENVIRONMENT.test;
    } else if ( process.env.NODE_ENV ) {
      this.environment = ENVIRONMENT[process.env.NODE_ENV as ENVIRONMENT];
    }

    const path = `${process.cwd()}/${this.base}/env/${this.environment}.env`;

    if (!existsSync(path)) {
      this.exit(`Environment file not found at ${path}`);
    }

    Dotenv({path});

    return this;
  }

  /**
   * @description Extract variables from process.env
   *
   * @param args Environment variables
   */
  extracts(args: Record<string,unknown>): Environment {
    this.variables = this.keys.reduce( (acc, current) => {
      acc[current] = args[current];
      return acc;
    }, {});
    return this;
  }

  /**
   * @description Parse allowed env variables, validate it and returns safe current or default value
   */
  validates(): Environment {

    this.keys.forEach( (key: string) => {
      this.variables[key] = this.rules[key](this.variables[key])
    });

    return this
  }

  /**
   * @description Aggregates some data for easy use
   */
  aggregates(): Environment {
    this.cluster = {
      ACCESS_TOKEN: {
        SECRET: this.variables.ACCESS_TOKEN_SECRET,
        DURATION: this.variables.ACCESS_TOKEN_DURATION
      },
      API_VERSION: this.variables.API_VERSION,
      AUTHORIZED: this.variables.AUTHORIZED,
      CDN: this.variables.CDN,
      CONTENT_TYPE: this.variables.CONTENT_TYPE,
      DOMAIN: this.variables.DOMAIN,
      ENV: this.environment,
      FACEBOOK: {
        KEY: 'facebook',
        IS_ACTIVE: this.variables.FACEBOOK_CONSUMER_ID !== null && this.variables.FACEBOOK_CONSUMER_SECRET !== null,
        ID: this.variables.FACEBOOK_CONSUMER_ID,
        SECRET: this.variables.FACEBOOK_CONSUMER_SECRET,
        CALLBACK_URL: `${this.variables.URL as string}/api/${this.variables.API_VERSION as string}/auth/facebook/callback`
      },
      GITHUB: {
        KEY: 'github',
        IS_ACTIVE: this.variables.GITHUB_CONSUMER_ID !== null && this.variables.GITHUB_CONSUMER_SECRET !== null,
        ID: this.variables.GITHUB_CONSUMER_ID,
        SECRET: this.variables.GITHUB_CONSUMER_SECRET,
        CALLBACK_URL: `${this.variables.URL as string}/api/${this.variables.API_VERSION as string}/auth/github/callback`
      },
      GOOGLE: {
        KEY: 'google',
        IS_ACTIVE: this.variables.GOOGLE_CONSUMER_ID !== null && this.variables.GOOGLE_CONSUMER_SECRET !== null,
        ID: this.variables.GOOGLE_CONSUMER_ID,
        SECRET: this.variables.GOOGLE_CONSUMER_SECRET,
        CALLBACK_URL: `${this.variables.URL as string}/api/${this.variables.API_VERSION as string}/auth/google/callback`
      },
      LINKEDIN: {
        KEY: 'linkedin',
        IS_ACTIVE: this.variables.LINKEDIN_CONSUMER_ID !== null && this.variables.LINKEDIN_CONSUMER_SECRET !== null,
        ID: this.variables.LINKEDIN_CONSUMER_ID,
        SECRET: this.variables.LINKEDIN_CONSUMER_SECRET,
        CALLBACK_URL: `${this.variables.URL as string}/api/${this.variables.API_VERSION as string}/auth/linkedin/callback`
      },
      LOGS: {
        PATH: this.variables.LOGS_PATH,
        TOKEN: this.variables.LOGS_TOKEN
      },
      MEMORY_CACHE: {
        IS_ACTIVE: this.variables.MEMORY_CACHE,
        DURATION: this.variables.MEMORY_CACHE_DURATION
      },
      PORT: this.variables.PORT,
      REFRESH_TOKEN: {
        DURATION: this.variables.REFRESH_TOKEN_DURATION,
        SECRET: this.variables.REFRESH_TOKEN_SECRET,
        UNIT: this.variables.REFRESH_TOKEN_UNIT
      },
      SCALING: {
        IS_ACTIVE: this.variables.RESIZE_IS_ACTIVE,
        PATH_MASTER: this.variables.RESIZE_PATH_MASTER,
        PATH_SCALE: this.variables.RESIZE_PATH_SCALE,
        SIZES: {
          XS: this.variables.RESIZE_SIZE_XS,
          SM: this.variables.RESIZE_SIZE_SM,
          MD: this.variables.RESIZE_SIZE_MD,
          LG: this.variables.RESIZE_SIZE_LG,
          XL: this.variables.RESIZE_SIZE_XL
        }
      },
      SSL: {
        IS_ACTIVE: this.variables.SSL_CERT !== null && this.variables.SSL_KEY !== null,
        CERT: this.variables.SSL_CERT,
        KEY: this.variables.SSL_KEY
      },
      TYPEORM: {
        DB: this.variables.TYPEORM_DB,
        NAME: this.variables.TYPEORM_NAME,
        TYPE: this.variables.TYPEORM_TYPE,
        HOST: this.variables.TYPEORM_HOST,
        PORT: this.variables.TYPEORM_PORT,
        PWD: this.variables.TYPEORM_PWD,
        USER: this.variables.TYPEORM_USER,
        SYNC: this.variables.TYPEORM_SYNC,
        LOG: this.variables.TYPEORM_LOG,
        CACHE: !this.variables.MEMORY_CACHE && this.variables.TYPEORM_CACHE,
        CACHE_DURATION: !this.variables.MEMORY_CACHE && this.variables.TYPEORM_CACHE ? this.variables.TYPEORM_CACHE_DURATION : 0,
        ENTITIES: [
          `${process.cwd()}/${this.base}/api/core/models/**/*.model.js`,
          `${process.cwd()}/${this.base}/api/resources/**/*.model.js`
        ],
        MIGRATIONS: `${process.cwd()}/${this.base}/migrations/**/*.js`,
        SUBSCRIBERS: [
          `${process.cwd()}/${this.base}/api/core/subscribers/**/*.subscriber.js`,
          `${process.cwd()}/${this.base}/api/resources/**/*.subscriber.js`
        ]
      },
      UPLOAD: {
        MAX_FILE_SIZE: this.variables.UPLOAD_MAX_FILE_SIZE,
        MAX_FILES: this.variables.UPLOAD_MAX_FILES,
        PATH: this.variables.UPLOAD_PATH,
        WILDCARDS: this.variables.UPLOAD_WILDCARDS
      },
      URL: this.variables.URL
    };

    return this;
  }

  /**
   * @description Creates files directories if not exists
   */
  directories(): Environment {
    const log = this.cluster.LOGS as { PATH: string };
    if ( !existsSync(log.PATH) ) {
      mkdirSync(log.PATH);
    }
    const upload = this.cluster.UPLOAD as { PATH: string };
    if ( !existsSync(upload.PATH) ) {
      mkdirSync(upload.PATH);
    }
    this.dirs.forEach(dir => {
      const path = `${upload.PATH}/${dir}`;
      if ( !existsSync(path) ) {
        mkdirSync(path);
      }
    });
    return this;
  }

  /**
   * @description Say if current environment is valid or not
   */
  isValid(): boolean {
    return this.errors.length === 0;
  }

  /**
   * @description Exit of current process with error messages
   *
   * @param messages
   */
  exit(messages: string|string[]): void {
    process.stdout.write('\n\x1b[41m[ERROR]\x1b[40m\n\n');
    process.stdout.write([].concat(messages).join('\n'));
    process.exit(0);
  }
}

const environment = Environment
  .get()
  .loads(process.versions.node)
  .extracts(process.env)
  .validates()
  .aggregates()
  .directories();

if (!environment.isValid()) environment.exit(environment.errors);

const ACCESS_TOKEN  = environment.cluster.ACCESS_TOKEN as EnvAccessToken;
const API_VERSION   = environment.cluster.API_VERSION as string;
const AUTHORIZED    = environment.cluster.AUTHORIZED as string;
const CDN           = environment.cluster.CDN as string;
const CONTENT_TYPE  = environment.cluster.CONTENT_TYPE as string;
const DOMAIN        = environment.cluster.DOMAINE as string;
const ENV           = environment.cluster.ENV as string;
const FACEBOOK      = environment.cluster.FACEBOOK as EnvOauth;
const GITHUB        = environment.cluster.GITHUB as EnvOauth;
const GOOGLE        = environment.cluster.GOOGLE as EnvOauth;
const LINKEDIN      = environment.cluster.LINKEDIN as EnvOauth;
const LOGS          = environment.cluster.LOGS as EnvLog;
const MEMORY_CACHE  = environment.cluster.MEMORY_CACHE as EnvMemoryCache;
const PORT          = environment.cluster.PORT as number;
const REFRESH_TOKEN = environment.cluster.REFRESH_TOKEN as EnvRefreshToken;
const SCALING       = environment.cluster.SCALING as EnvImageScaling;
const SSL           = environment.cluster.SSL as EnvSSL;
const TYPEORM       = environment.cluster.TYPEORM as EnvTypeorm;
const UPLOAD        = environment.cluster.UPLOAD as EnvUpload;
const URL           = environment.cluster.URL as string;

export { ACCESS_TOKEN, API_VERSION, AUTHORIZED, CDN, CONTENT_TYPE, DOMAIN, ENV, FACEBOOK, GITHUB, GOOGLE, LINKEDIN, LOGS, MEMORY_CACHE, PORT, REFRESH_TOKEN, SCALING, SSL, TYPEORM, UPLOAD, URL }