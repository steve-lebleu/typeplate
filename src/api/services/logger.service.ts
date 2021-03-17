import { LoggerConfiguration } from '@config/logger.config';
import { Logger as WinstonLogger } from 'winston';

/**
 * Log service
 */
class Logger {

  /**
   * @description Wrapped logger instance, here winston
   */
  private static instance: Logger;

  /**
   * @description
   */
  engine: WinstonLogger;

  private constructor(engine: WinstonLogger) {
    this.engine = engine;
  }

  static get(engine: WinstonLogger): Logger {
    if ( !Logger.instance ) {
      Logger.instance = new Logger(engine)
    }
    return Logger.instance;
  }

  /**
   * @description Do log action
   *
   * @param level
   * @param message
   */
  log(level: string, message: string ): void {
    this.engine[level](message);
  }
}

const logger = Logger.get( LoggerConfiguration.logger );

export { logger as Logger }