import { createWriteStream } from 'fs';

import * as Winston from 'winston';
import * as Morgan from 'morgan';

import { format, Logger as WinstonLogger } from 'winston';

import { ENV, LOGS } from '@config/environment.config';
import { ENVIRONMENT } from '@enums';

/**
 * @see https://github.com/winstonjs/winston
 * @see https://github.com/expressjs/morgan
 */
class LoggerConfiguration {

  /**
   * @description
   */
  private static instance: LoggerConfiguration;

  /**
   * @description Wrapped Winston instance
   */
  logger: WinstonLogger;

  /**
   * @description
   */
  private stream: any = {
    write:(message: string) => {
      this.logger.info(message.substring(0, message.lastIndexOf('\n')));
    }
  };

  /**
   * @description Output format
   */
  private formater = format.printf( ( { level, message, label, timestamp } ) => {
    return `${timestamp as string} [${level}] ${message}`;
  });

  /**
   * @description Default options
   */
  private options = {
    error: {
      level: 'error',
      format: format.combine(
        format.timestamp(),
        this.formater
      ),
      filename: `${LOGS.PATH}/error.log`,
      handleException: true,
      json: true,
      maxSize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    },
    info: {
      level: 'info',
      format: format.combine(
        format.timestamp(),
        this.formater
      ),
      filename: `${LOGS.PATH}/combined.log`,
      handleException: false,
      json: true,
      maxSize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    },
    console: {
      format: Winston.format.simple(),
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    }
  };

  private constructor() {}

  /**
   * @description
   */
  static get(): LoggerConfiguration {
    if (!LoggerConfiguration.instance) {
      LoggerConfiguration.instance = new LoggerConfiguration();
    }
    return LoggerConfiguration.instance;
  }

  /**
   * @description Initialize default logger configuration
   */
  init(): LoggerConfiguration {

    if (LoggerConfiguration.instance && this.logger) {
      return this;
    }

    this.logger = Winston.createLogger({
      level: 'info',
      transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new Winston.transports.File(this.options.error),
        new Winston.transports.File(this.options.info),
      ],
      exitOnError: false
    });

    if ( !['production', 'test'].includes(ENV) ) {
      this.logger.add( new Winston.transports.Console(this.options.console) );
    }

    return this;
  }

  /**
   * @description
   */
  writeStream(): ReadableStream {
    return Morgan(LOGS.TOKEN, { stream: ( ENV === ENVIRONMENT.production ? createWriteStream(`${LOGS.PATH}/access.log`, { flags: 'a+' }) : this.stream ) as ReadableStream } ) as ReadableStream
  }

}

const config = LoggerConfiguration
  .get()
  .init();

export { config as LoggerConfiguration }