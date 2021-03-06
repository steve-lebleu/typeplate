import { ENVIRONMENT } from '@enums/environment.enum';
import { MIME_TYPE } from '@enums/mime-type.enum';

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
      this.environment = ENVIRONMENT[process.argv[3]] as string;
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
    const dtv: { config: (options) => void, parse: () => void } = require('dotenv') as { config: () => void, parse: () => void };
    dtv.config( { path : `${process.cwd()}/dist/env/${this.environment}.env` } );
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
const contentType           = process.env.CONTENT_TYPE;
const typeorm               = {
  type: process.env.TYPEORM_TYPE,
  name: process.env.TYPEORM_NAME,
  port: process.env.TYPEORM_PORT,
  host: process.env.TYPEORM_HOST,
  database: process.env.TYPEORM_DB,
  user: process.env.TYPEORM_USER,
  pwd: process.env.TYPEORM_PWD,
  sync: process.env.NODE_ENV === ENVIRONMENT.production ? false : !!process.env.TYPEORM_SYNC,
  log: !!process.env.TYPEORM_LOG,
};
const upload                = {
  path: `${process.cwd()}/dist/${process.env.UPLOAD_PATH}`,
  maxFileSize: parseInt(process.env.UPLOAD_MAX_FILE_SIZE, 10),
  wildcards: MIME_TYPE as string[],
  maxFiles: parseInt(process.env.UPLOAD_MAX_FILES, 10)
};
const jimp                  = {
  isActive: parseInt(process.env.JIMP_IS_ACTIVE, 10),
  xs: parseInt(process.env.JIMP_SIZE_XS, 10),
  sm: parseInt(process.env.JIMP_SIZE_SM, 10),
  md: parseInt(process.env.JIMP_SIZE_MD, 10),
  lg: parseInt(process.env.JIMP_SIZE_LG, 10),
  xl: parseInt(process.env.JIMP_SIZE_XL, 10)
};
const ssl                 = {
  isActive: parseInt(process.env.HTTPS_IS_ACTIVE, 10),
  key: process.env.HTTPS_KEY,
  cert: process.env.HTTPS_CERT
};
const logs                = {
  token: process.env.NODE_ENV === 'production' ? 'combined' : process.env.LOGS_MORGAN_TOKEN,
  path: `${process.cwd()}/dist/${process.env.LOGS_PATH}`
};

export { env, port, url, authorized, contentType, ssl, jwtSecret, jwtExpirationInterval, version, logs, typeorm, upload, jimp };