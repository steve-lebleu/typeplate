import * as Winston from 'winston';
import { format, Logger as WinstonLogger } from 'winston';

import { env } from '@config/environment.config';

/**
 * This logger implements Winston module for writing custom logs
 *
 * @see https://github.com/winstonjs/winston
 */
export class WinstonConfiguration {

  /**
   * @description Wrapped Winston instance
   */
  private static logger: WinstonLogger;

  /**
   * @description Output format
   */
  private static formater = format.printf( ( { level, message, label, timestamp } ) => {
    return `${timestamp as string} [${level}] ${message}`;
  });

  /**
   * @description Default options
   */
  private static options = {
    error: {
      level: 'error',
      format: format.combine(
        format.timestamp(),
        WinstonConfiguration.formater
      ),
      filename: `${process.cwd()}/dist/logs/error.log`,
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
        WinstonConfiguration.formater
      ),
      filename: `${process.cwd()}/dist/logs/combined.log`,
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

  constructor() {}

  /**
   * @description Generic property getter
   */
  public static get(): WinstonLogger {
    if ( !WinstonConfiguration.logger ) {
      WinstonConfiguration.init();
    }
    return WinstonConfiguration.logger;
  }

  /**
   * @description Initialize default logger configuration
   */
  private static init(): void {
    const logger = Winston.createLogger({
      level: 'info',
      transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new Winston.transports.File(WinstonConfiguration.options.error),
        new Winston.transports.File(WinstonConfiguration.options.info),
      ],
      exitOnError: false
    });

    // If we're not in production||test then log to the `console`
    if ( !['production', 'test'].includes(process.env.NODE_ENV) ) {
      logger.add( new Winston.transports.Console(WinstonConfiguration.options.console) );
    }

    WinstonConfiguration.logger = logger;
  }

}