import { WinstonConfiguration } from '@config/winston.config';
import { Logger as WinstonLogger } from 'winston';

/**
 * Log service
 */
export class Logger {

  /**
   * @description Wrapped logger instance, here winston
   */
  private static instance?: WinstonLogger;

  constructor() {}

  /**
   * @description Do log action
   * @param level
   * @param message
   * @param scope
   */
  static log(level: string, message: string ): void {
    if ( !Logger.instance ) {
      Logger.instance = WinstonConfiguration.get()
    }
    Logger.instance[level](message);
  }

  static get stream(): any {
    if ( !Logger.instance ) {
      Logger.instance = WinstonConfiguration.get()
    }
    return {
      write:(message: string) => {
        Logger.instance.info(message.substring(0, message.lastIndexOf('\n')));
      }
    }
  }
}