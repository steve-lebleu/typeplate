import { LoggerConfiguration } from '@config/logger.config';
import { Logger as WinstonLogger } from 'winston';

/**
 * Log service
 */
class Logger {

  /**
   * @description Wrapped logger instance, here winston
   */
  private static instance: WinstonLogger;

  private constructor() {}

  static get(engine: WinstonLogger): WinstonLogger {
    if ( !Logger.instance ) {
      Logger.instance = engine
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
    Logger.instance[level](message);
  }
}

const logger = Logger.get(LoggerConfiguration.logger);

export { logger as Logger }