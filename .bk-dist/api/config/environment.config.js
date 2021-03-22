"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URL = exports.UPLOAD = exports.TYPEORM = exports.SSL = exports.SCALING = exports.REFRESH_TOKEN = exports.PORT = exports.MEMORY_CACHE = exports.LOGS = exports.JWT = exports.LINKEDIN = exports.GOOGLE = exports.GITHUB = exports.FACEBOOK = exports.ENV = exports.DOMAIN = exports.CONTENT_TYPE = exports.AUTHORIZED = exports.API_VERSION = exports.Environment = void 0;
const fs_1 = require("fs");
const dotenv_1 = require("dotenv");
const _enums_1 = require("@enums");
const enum_util_1 = require("@utils/enum.util");
/**
 *
 * @dependency dotenv
 *
 * @see https://www.npmjs.com/package/dotenv
 *
 */
class Environment {
    constructor() {
        /**
         * @description Current environment
         */
        this.environment = _enums_1.ENVIRONMENT.development;
        /**
         * @description Errors staged on current environment
         */
        this.errors = [];
    }
    /**
     * @description Environment singleton getter
     */
    static get() {
        if (!Environment.instance) {
            Environment.instance = new Environment();
        }
        return Environment.instance;
    }
    /**
     * @description Env variables exhaustive key list
     */
    get keys() {
        return [
            'API_VERSION',
            'AUTHORIZED',
            'CONTENT_TYPE',
            'DOMAIN',
            'FACEBOOK_CONSUMER_ID',
            'FACEBOOK_CONSUMER_SECRET',
            'GITHUB_CONSUMER_ID',
            'GITHUB_CONSUMER_SECRET',
            'GOOGLE_CONSUMER_ID',
            'GOOGLE_CONSUMER_SECRET',
            'JWT_EXPIRATION_MINUTES',
            'JWT_SECRET',
            'LINKEDIN_CONSUMER_ID',
            'LINKEDIN_CONSUMER_SECRET',
            'LOGS_PATH',
            'LOGS_TOKEN',
            'MEMORY_CACHE',
            'MEMORY_CACHE_DURATION',
            'PORT',
            'REFRESH_TOKEN_DURATION',
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
        ];
    }
    /**
     * @description Embeded validation rules for env variables
     */
    get rules() {
        return {
            /**
             * @description Current api version
             *
             * @default v1
             */
            API_VERSION: (value) => {
                return value ? value.trim().toLowerCase() : 'v1';
            },
            /**
             * @description Authorized remote(s) host(s)
             *
             * @default null
             */
            AUTHORIZED: (value) => {
                const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}(:[0-9]{1,5})|\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
                if (!value) {
                    this.errors.push('AUTHORIZED not found: please fill a single host as string or multiple hosts separated by coma (ie: http://my-domain.com or http://my-domain-1.com,http://my-domain-2.com, ...');
                }
                if (value && value.lastIndexOf(',') === -1 && !regex.test(value)) {
                    this.errors.push('AUTHORIZED bad value: please fill a single host as string or multiple hosts separated by coma (ie: http://my-domain.com or http://my-domain-1.com,http://my-domain-2.com, ...');
                }
                if (value && value.lastIndexOf(',') !== -1 && value.split(',').some(v => !regex.test(v))) {
                    this.errors.push('AUTHORIZED bad value: please fill a single host as string or multiple hosts separated by coma (ie: http://my-domain.com or http://my-domain-1.com,http://my-domain-2.com, ...');
                }
                return value ? value.trim().toLowerCase() : null;
            },
            /**
             * @description Content-Type
             *
             * @default application/json
             */
            CONTENT_TYPE: (value) => {
                if (value && !_enums_1.CONTENT_TYPE[value]) {
                    this.errors.push(`CONTENT_TYPE bad value: please fill a supported Content-Type must be one of ${enum_util_1.list(_enums_1.CONTENT_TYPE).join(',')}`);
                }
                return value || _enums_1.CONTENT_TYPE['application/json'];
            },
            /**
             * @description Domain of the application in current environment
             *
             * @default localhost
             */
            DOMAIN: (value) => {
                return value ? value.trim().toLowerCase() : 'localhost';
            },
            /**
             * @description Facebook application id
             *
             * @default null
             */
            FACEBOOK_CONSUMER_ID: (value) => {
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
            FACEBOOK_CONSUMER_SECRET: (value) => {
                if (value && /[0-9-abcdef]{32}/.test(value) === false) {
                    this.errors.push('FACEBOOK_CONSUMER_SECRET bad value: check your Facebook app settings to fill a correct value.');
                }
                return value || null;
            },
            /**
             * @description Github application id
             *
             * @default null
             */
            GITHUB_CONSUMER_ID: (value) => {
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
            GITHUB_CONSUMER_SECRET: (value) => {
                if (value && /[0-9-A-Z-a-z-_]{40}/.test(value) === false) {
                    this.errors.push('GITHUB_CONSUMER_SECRET bad value: check your Github app and fill a correct value in your .env file.');
                }
                return value || null;
            },
            /**
             * @description Google application id
             *
             * @default null
             */
            GOOGLE_CONSUMER_ID: (value) => {
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
            GOOGLE_CONSUMER_SECRET: (value) => {
                if (value && /[0-9-A-Z-a-z-_]{24}/.test(value) === false) {
                    this.errors.push('GOOGLE_CONSUMER_SECRET bad value: check your Google app and fill a correct value in your .env file.');
                }
                return value || null;
            },
            /**
             * @description JWT exiration duration in minutes
             *
             * @default 120960
             */
            JWT_EXPIRATION_MINUTES: (value) => {
                if (value && isNaN(parseInt(value, 10))) {
                    this.errors.push('JWT_EXPIRATION_MINUTES bad value: please fill a duration expressed as a number');
                }
                return parseInt(value, 10) || 120960;
            },
            /**
             * @description JWT secret token
             *
             * @default null
             */
            JWT_SECRET: (value) => {
                if (!value) {
                    this.errors.push('JWT_SECRET not found: please fill a jwt secret value in your .env file to strengthen the encryption.');
                }
                if (value && value.toString().length < 32) {
                    this.errors.push('JWT_SECRET bad value: please fill a jwt secret which have a length >= 32.');
                }
                return value ? value.toString() : null;
            },
            /**
             * @description Linkedin application id
             *
             * @default null
             */
            LINKEDIN_CONSUMER_ID: (value) => {
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
            LINKEDIN_CONSUMER_SECRET: (value) => {
                if (value && /[0-9-A-Z-a-z-_]{40}/.test(value) === false) {
                    this.errors.push('LINKEDIN_CONSUMER_SECRET bad value: check your Linkedin app and fill a correct value in your .env file.');
                }
                return value || null;
            },
            /**
             * @description Logs token configuration used by Morgan for output pattern
             *
             * @default dev
             */
            LOGS_TOKEN: (value) => {
                return this.environment === 'production' ? 'combined' : value || 'dev';
            },
            /**
             * @description Logs path root directory
             *
             * @default logs
             */
            LOGS_PATH: (value) => {
                return `${process.cwd()}/${this.base}/${value || 'logs'}`;
            },
            /**
             * @description Memory cache activated
             *
             * @default false
             */
            MEMORY_CACHE: (value) => {
                return !!parseInt(value, 10) || false;
            },
            /**
             * @description Memory cache lifetime duration
             *
             * @default 5000
             */
            MEMORY_CACHE_DURATION: (value) => {
                return parseInt(value, 10) || 5000;
            },
            /**
             * @description Listened port. Default 8101
             *
             * @default 8101
             */
            PORT: (value) => {
                if (value && (isNaN(parseInt(value, 10)) || parseInt(value, 10) > 65535)) {
                    this.errors.push('PORT bad value: please fill a valid TCP port number');
                }
                return parseInt(value, 10) || 8101;
            },
            /**
             * @description Refresh token duration
             *
             * @default 30
             */
            REFRESH_TOKEN_DURATION: (value) => {
                if (value && isNaN(parseInt(value, 10))) {
                    this.errors.push('REFRESH_TOKEN_DURATION bad value: duration must be a number expressed in minutes.');
                }
                return parseInt(value, 10) || 30;
            },
            /**
             * @description Refresh token unit of duration (hours|days|weeks|months)
             *
             * @default 30
             */
            REFRESH_TOKEN_UNIT: (value) => {
                if (value && !['hours', 'days', 'weeks', 'months'].includes(value)) {
                    this.errors.push('REFRESH_TOKEN_UNIT bad value: unit must be one of hours, days, weeks, months.');
                }
                return (value || 'days');
            },
            /**
             * @description Image resizing activated
             *
             * @default true
             */
            RESIZE_IS_ACTIVE: (value) => {
                return !!parseInt(value, 10) || true;
            },
            /**
             * @description Directory name for original copy (required)
             *
             * @default master-copy
             */
            RESIZE_PATH_MASTER: (value) => {
                return value || 'master-copy';
            },
            /**
             * @description Directory name for resizes
             *
             * @default rescale
             */
            RESIZE_PATH_SCALE: (value) => {
                return value || 'rescale';
            },
            /**
             * @description
             *
             * @default 1024
             */
            RESIZE_SIZE_LG: (value) => {
                return parseInt(value, 10) || 1024;
            },
            /**
             * @description
             *
             * @default 768
             */
            RESIZE_SIZE_MD: (value) => {
                return parseInt(value, 10) || 768;
            },
            /**
             * @description
             *
             * @default 320
             */
            RESIZE_SIZE_SM: (value) => {
                return parseInt(value, 10) || 320;
            },
            /**
             * @description
             *
             * @default 1366
             */
            RESIZE_SIZE_XL: (value) => {
                return parseInt(value, 10) || 1366;
            },
            /**
             * @description
             *
             * @default 280
             */
            RESIZE_SIZE_XS: (value) => {
                return parseInt(value, 10) || 280;
            },
            /**
             * @description SSL certificate location
             *
             * @default null
             */
            SSL_CERT: (value) => {
                if (value && !fs_1.existsSync(value)) {
                    this.errors.push('SSL_CERT bad value or SSL certificate not found. Please check path and/or file access rights.');
                }
                return value || null;
            },
            /**
             * @description SSL key location
             *
             * @default null
             */
            SSL_KEY: (value) => {
                if (value && !fs_1.existsSync(value)) {
                    this.errors.push('SSL_KEY bad value or SSL key not found. Please check path and/or file access rights.');
                }
                return value || null;
            },
            /**
             * @description
             *
             * @default null
             */
            TYPEORM_DB: (value) => {
                if (!value) {
                    this.errors.push('TYPEORM_DB not found: please define the targeted database.');
                }
                if (value && /^[0-9a-zA-Z_]{3,}$/.test(value) === false) {
                    this.errors.push('TYPEORM_DB bad value: please check the name of your database according [0-9a-zA-Z_].');
                }
                return value || null;
            },
            /**
             * @description
             *
             * @default false
             */
            TYPEORM_CACHE: (value) => {
                if (value && isNaN(parseInt(value, 10))) {
                    this.errors.push('TYPEORM_CACHE bad value: please use 0 or 1 to define activation of the db cache');
                }
                return !!parseInt(value, 10) || false;
            },
            /**
             * @description
             *
             * @default 5000
             */
            TYPEORM_CACHE_DURATION: (value) => {
                if (value && isNaN(parseInt(value, 10))) {
                    this.errors.push('TYPEORM_CACHE_DURATION bad value: please fill it with a duration expressed in ms.');
                }
                return parseInt(value, 10) || 5000;
            },
            /**
             * @description
             *
             * @default localhost
             */
            TYPEORM_HOST: (value) => {
                if (!value) {
                    this.errors.push('TYPEORM_HOST not found: please define the database server host.');
                }
                if (value && value !== 'localhost' && /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/.test(value) === false) {
                    this.errors.push('TYPEORM_HOST bad value: please fill it with a valid database server host.');
                }
                return value || 'localhost';
            },
            /**
             * @description
             *
             * @default false
             */
            TYPEORM_LOG: (value) => {
                return !!parseInt(value, 10) || false;
            },
            /**
             * @description
             *
             * @default default
             */
            TYPEORM_NAME: (value) => {
                return value || 'default';
            },
            /**
             * @description
             *
             * @default 3306
             */
            TYPEORM_PORT: (value) => {
                if (!value) {
                    this.errors.push('TYPEORM_PORT not found: please define the database server port.');
                }
                return parseInt(value, 10) || 3306;
            },
            /**
             * @description
             *
             * @default null
             */
            TYPEORM_PWD: (value) => {
                if (!value && ![_enums_1.ENVIRONMENT.test, _enums_1.ENVIRONMENT.development].includes(this.environment)) {
                    this.errors.push('TYPEORM_PWD not found: please define the database user password.');
                }
                return value || null;
            },
            /**
             * @description
             *
             * @default false
             */
            TYPEORM_SYNC: (value) => {
                return this.environment === _enums_1.ENVIRONMENT.production ? false : !!parseInt(value, 10) || false;
            },
            /**
             * @description
             *
             * @default mysql
             */
            TYPEORM_TYPE: (value) => {
                if (!value) {
                    this.errors.push('TYPEORM_TYPE not found: please define the database engine type.');
                }
                if (value && !_enums_1.DATABASE_ENGINE[value]) {
                    this.errors.push(`TYPEORM_TYPE bad value: database engine must be one of following: ${enum_util_1.list(_enums_1.DATABASE_ENGINE).join(',')}.`);
                }
                return (value || 'mysql');
            },
            /**
             * @description
             *
             * @default null
             */
            TYPEORM_USER: (value) => {
                if (!value) {
                    this.errors.push('TYPEORM_USER not found: please define one user for your database.');
                }
                return value || null;
            },
            /**
             * @description Max upload file size
             *
             * @default 2000000
             */
            UPLOAD_MAX_FILE_SIZE: (value) => {
                if (value && isNaN(parseInt(value, 10))) {
                    this.errors.push('UPLOAD_MAX_FILE_SIZE bad value: please fill it with an integer.');
                }
                return parseInt(value, 10) || 2000000;
            },
            /**
             * @description Max number of uploaded files by request
             *
             * @default 5
             */
            UPLOAD_MAX_FILES: (value) => {
                if (value && isNaN(parseInt(value, 10))) {
                    this.errors.push('UPLOAD_MAX_FILES bad value: please fill it with an integer.');
                }
                return parseInt(value, 10) || 5;
            },
            /**
             * @description Upload directory path
             *
             * @default public
             */
            UPLOAD_PATH: (value) => {
                return `${process.cwd()}/${this.base}/${value || 'public'}`;
            },
            /**
             * @description Accepted mime-type
             *
             * @default AUDIO|ARCHIVE|DOCUMENT|IMAGE|VIDEO
             */
            UPLOAD_WILDCARDS: (value) => {
                const mimes = { AUDIO: _enums_1.AUDIO_MIME_TYPE, ARCHIVE: _enums_1.ARCHIVE_MIME_TYPE, DOCUMENT: _enums_1.DOCUMENT_MIME_TYPE, IMAGE: _enums_1.IMAGE_MIME_TYPE, VIDEO: _enums_1.VIDEO_MIME_TYPE };
                const input = value ? value.toString().split(',') : Object.keys(mimes);
                const keys = Object.keys(mimes).map(k => k.toLowerCase());
                if (value && value.toString().split(',').some(key => !keys.includes(key))) {
                    this.errors.push(`UPLOAD_WILDCARDS bad value: please fill it with an accepted value (${keys.join(',')}) with coma separation`);
                }
                return input
                    .filter(key => mimes[key])
                    .map(key => mimes[key])
                    .reduce((acc, current) => {
                    return [...acc, ...enum_util_1.list(current)];
                }, []);
            },
            /**
             * @description API main URL
             *
             * @default http://localhost:8101
             */
            URL: (value) => {
                const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}(\.[a-zA-Z0-9()]{1,})?(:[0-9]{1,5})?/;
                if (value && regex.test(value) === false) {
                    this.errors.push('URL bad value. Please fill a local or remote URL');
                }
                return value || 'http://localhost:8101';
            }
        };
    }
    /**
     * @description Set env according to args, and load .env file
     */
    loads(nodeVersion) {
        const [major, minor] = nodeVersion.split('.').map(parseFloat);
        if (major < 14 || major === 14 && minor < 16) {
            this.exit('The node version of the server is too low. Please consider at least v14.16.0.');
        }
        if (process.argv && process.argv.indexOf('--env') !== -1) {
            this.environment = _enums_1.ENVIRONMENT[process.argv[process.argv.indexOf('--env') + 1]] || _enums_1.ENVIRONMENT.development;
        }
        switch (this.environment) {
            case _enums_1.ENVIRONMENT.development:
                this.base = 'dist';
                break;
            case _enums_1.ENVIRONMENT.staging:
                this.base = '';
                break;
            case _enums_1.ENVIRONMENT.production:
                this.base = '';
                break;
            case _enums_1.ENVIRONMENT.test:
                this.base = 'dist';
                break;
        }
        const path = `${process.cwd()}/${this.base}/env/${this.environment}.env`;
        if (!fs_1.existsSync(path)) {
            this.exit(`Environment file not found at ${path}`);
        }
        dotenv_1.config({ path });
        return this;
    }
    /**
     * @description Extract variables from process.env
     *
     * @param args Environment variables
     */
    extracts(args) {
        this.variables = this.keys.reduce((acc, current) => {
            acc[current] = args[current];
            return acc;
        }, {});
        return this;
    }
    /**
     * @description Parse allowed env variables, validate it and returns safe current or default value
     */
    validates() {
        this.keys.forEach((key) => {
            this.variables[key] = this.rules[key](this.variables[key]);
        });
        return this;
    }
    /**
     * @description Aggregates some data for easy use
     */
    aggregates() {
        this.cluster = {
            API_VERSION: this.variables.API_VERSION,
            AUTHORIZED: this.variables.AUTHORIZED,
            CONTENT_TYPE: this.variables.CONTENT_TYPE,
            DOMAIN: this.variables.DOMAIN,
            ENV: this.environment,
            JWT: {
                SECRET: this.variables.JWT_SECRET,
                EXPIRATION: this.variables.JWT_EXPIRATION_MINUTES
            },
            FACEBOOK: {
                KEY: 'facebook',
                IS_ACTIVE: this.variables.FACEBOOK_CONSUMER_ID !== null && this.variables.FACEBOOK_CONSUMER_SECRET !== null,
                ID: this.variables.FACEBOOK_CONSUMER_ID,
                SECRET: this.variables.FACEBOOK_CONSUMER_SECRET,
                CALLBACK_URL: `${this.variables.URL}/api/${this.variables.API_VERSION}/auth/facebook/callback`
            },
            GITHUB: {
                KEY: 'github',
                IS_ACTIVE: this.variables.GITHUB_CONSUMER_ID !== null && this.variables.GITHUB_CONSUMER_SECRET !== null,
                ID: this.variables.GITHUB_CONSUMER_ID,
                SECRET: this.variables.GITHUB_CONSUMER_SECRET,
                CALLBACK_URL: `${this.variables.URL}/api/${this.variables.API_VERSION}/auth/github/callback`
            },
            GOOGLE: {
                KEY: 'google',
                IS_ACTIVE: this.variables.GOOGLE_CONSUMER_ID !== null && this.variables.GOOGLE_CONSUMER_SECRET !== null,
                ID: this.variables.GOOGLE_CONSUMER_ID,
                SECRET: this.variables.GOOGLE_CONSUMER_SECRET,
                CALLBACK_URL: `${this.variables.URL}/api/${this.variables.API_VERSION}/auth/google/callback`
            },
            LINKEDIN: {
                KEY: 'linkedin',
                IS_ACTIVE: this.variables.LINKEDIN_CONSUMER_ID !== null && this.variables.LINKEDIN_CONSUMER_SECRET !== null,
                ID: this.variables.LINKEDIN_CONSUMER_ID,
                SECRET: this.variables.LINKEDIN_CONSUMER_SECRET,
                CALLBACK_URL: `${this.variables.URL}/api/${this.variables.API_VERSION}/auth/linkedin/callback`
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
                ENTITIES: `${process.cwd()}/${this.base}/api/models/**/*.js`,
                MIGRATIONS: `${process.cwd()}/${this.base}/migrations/**/*.js`,
                SUBSCRIBERS: `${process.cwd()}/${this.base}/api/subscribers/**/*.subscriber.js`
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
     * @description Say if current environment is valid or not
     */
    isValid() {
        return this.errors.length === 0;
    }
    /**
     * @description Exit of current process with error messages
     *
     * @param messages
     */
    exit(messages) {
        process.stdout.write('\n\x1b[41m[ERROR]\x1b[40m\n\n');
        process.stdout.write([].concat(messages).join('\n'));
        process.exit(0);
    }
}
exports.Environment = Environment;
const environment = Environment
    .get()
    .loads(process.versions.node)
    .extracts(process.env)
    .validates()
    .aggregates();
if (!environment.isValid())
    environment.exit(environment.errors);
const API_VERSION = environment.cluster.API_VERSION;
exports.API_VERSION = API_VERSION;
const AUTHORIZED = environment.cluster.AUTHORIZED;
exports.AUTHORIZED = AUTHORIZED;
const CONTENT_TYPE = environment.cluster.CONTENT_TYPE;
exports.CONTENT_TYPE = CONTENT_TYPE;
const DOMAIN = environment.cluster.DOMAINE;
exports.DOMAIN = DOMAIN;
const ENV = environment.cluster.ENV;
exports.ENV = ENV;
const FACEBOOK = environment.cluster.FACEBOOK;
exports.FACEBOOK = FACEBOOK;
const GITHUB = environment.cluster.GITHUB;
exports.GITHUB = GITHUB;
const GOOGLE = environment.cluster.GOOGLE;
exports.GOOGLE = GOOGLE;
const JWT = environment.cluster.JWT;
exports.JWT = JWT;
const LINKEDIN = environment.cluster.LINKEDIN;
exports.LINKEDIN = LINKEDIN;
const LOGS = environment.cluster.LOGS;
exports.LOGS = LOGS;
const MEMORY_CACHE = environment.cluster.MEMORY_CACHE;
exports.MEMORY_CACHE = MEMORY_CACHE;
const PORT = environment.cluster.PORT;
exports.PORT = PORT;
const REFRESH_TOKEN = environment.cluster.REFRESH_TOKEN;
exports.REFRESH_TOKEN = REFRESH_TOKEN;
const SCALING = environment.cluster.SCALING;
exports.SCALING = SCALING;
const SSL = environment.cluster.SSL;
exports.SSL = SSL;
const TYPEORM = environment.cluster.TYPEORM;
exports.TYPEORM = TYPEORM;
const UPLOAD = environment.cluster.UPLOAD;
exports.UPLOAD = UPLOAD;
const URL = environment.cluster.URL;
exports.URL = URL;
