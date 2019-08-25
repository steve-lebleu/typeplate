import { env } from "@config/environment.config";
import * as Winston from "winston";
import { format } from "winston";

/**
 * This logger implements Winston module for writing custom logs
 * 
 * @see https://github.com/winstonjs/winston
 */
export class WinstonConfiguration {

  /**
   * @description Wrapped Winston instance
   */
  private logger: any;

  /**
   * @description Wrap and expose Winston.logger.stream
   * @alias this.logger.stream
   */
  private stream;

  /**
   * @description Output directory
   */
  private output = env === 'test' ? 'test' : 'dist';

  /**
   * @description Output format
   */
  private formater = format.printf( ( { level, message, label, timestamp } ) => {
    return `${timestamp} [${level}] ${label} : ${message}`;
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
      filename: `${process.cwd()}/${this.output}/logs/error.log`,
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
      filename: `${process.cwd()}/${this.output}/logs/combined.log`,
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

  constructor() {

    let logger = Winston.createLogger({
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
    
    // If we're not in production||test then log to the `console`
    if ( !['production', 'test'].includes(process.env.NODE_ENV) ) {
      logger.add( new Winston.transports.Console(this.options.console) );
    }
    
    logger.stream = { 
      write: function(message, encoding) { 
        logger.info(message.trim()); 
      } 
    } as any;

    this.logger = logger;
    this.stream = this.logger.stream;

  }

  /**
   * @description Generic property getter
   * 
   * @param {string} property Property name to returns
   */
  get(property: string) { 
    return this[property];
  }
}