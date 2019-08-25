import { ENVIRONMENT } from '@enums/environment.enum';
import { list } from '@utils/enum.util';
import { UPLOAD_MIME_TYPE } from '@enums/mime-type.enum';

/**
 * Configure dotenv with variables.env file before app, to allow process.env accessibility in 
 * app.js
 * 
 * @dependency dotenv
 * 
 * @see https://www.npmjs.com/package/dotenv
 */
class EnvironmentConfiguration {
  
  /**
   * @description Current environment (default dev)
   */
  static environment: string = ENVIRONMENT.development;

  /**
   * @description Set environment according to current process args
   */
  static set() {
    if (process.argv[2] && process.argv[2] === '--env' && process.argv[3] && ENVIRONMENT.hasOwnProperty(process.argv[3]) ) {
      this.environment = ENVIRONMENT[process.argv[3]];
    }
    if (process.env.ENVIRONMENT && ENVIRONMENT.hasOwnProperty(process.env.ENVIRONMENT) ) {
      this.environment = process.env.ENVIRONMENT as ENVIRONMENT;
    }
  }

  /**
   * @description Load .env file according to environment
   */
  static load() {
    this.set();
    require('dotenv').config( { path : `${process.cwd()}/dist/env/${this.environment}.env` } );
  }
}

EnvironmentConfiguration.load();

const env                   = process.env.NODE_ENV;
const version               = process.env.API_VERSION;
const port                  = process.env.PORT;
const url                   = process.env.URL;
const authorized            = process.env.AUTHORIZED;
const jwtSecret             = process.env.JWT_SECRET;
const jwtExpirationInterval = process.env.JWT_EXPIRATION_MINUTES;
const logs                  = process.env.NODE_ENV === 'production' ? 'combined' : 'development';
const httpLogs              = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
const contentType           = process.env.CONTENT_TYPE;
const typeorm               = { 
  type: process.env.TYPEORM_TYPE, 
  name: process.env.TYPEORM_NAME,
  port: process.env.TYPEORM_PORT, 
  host: process.env.TYPEORM_HOST, 
  database: process.env.TYPEORM_DB, 
  user: process.env.TYPEORM_USER, 
  pwd: process.env.TYPEORM_PWD 
};
const upload                = {
  path: process.cwd() + '/dist/' + process.env.UPLOAD_PATH,
  maxFileSize: parseInt(process.env.UPLOAD_MAX_FILE_SIZE, 10),
  wildcards: list(UPLOAD_MIME_TYPE) as UPLOAD_MIME_TYPE[],
  maxFiles: parseInt(process.env.UPLOAD_MAX_FILES, 10)
};
const jimp                  = {
  isActive: parseInt(process.env.JIMP_IS_ACTIVE, 10),
  xs: parseInt(process.env.JIMP_SIZE_XS, 10),
  md: parseInt(process.env.JIMP_SIZE_MD, 10),
  xl: parseInt(process.env.JIMP_SIZE_XL, 10),
};
const ssl                 = {
  isActive: parseInt(process.env.HTTPS_IS_ACTIVE, 10),
  key: process.env.HTTPS_KEY,
  cert: process.env.HTTPS_CERT
};

export { env, port, url, authorized, contentType, ssl, jwtSecret, jwtExpirationInterval, version, logs, httpLogs, typeorm, upload, jimp };