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

  static get() {
    if ( !Logger.instance ) {
      Logger.instance = LoggerConfiguration.logger
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

const logger = Logger.get();

export { logger as Logger }