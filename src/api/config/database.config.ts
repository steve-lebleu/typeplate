import 'reflect-metadata';

import { DataSource } from 'typeorm';
import { ENV } from '@config/environment.config';
import { Logger } from '@services/logger.service';

/**
 * Typeorm default configuration
 *
 * @see https://http://typeorm.io
 */
export class Database {

  static dataSource: DataSource = null;

  constructor () { }

  /**
   * @description Connect to MySQL server
   * @async
   */
  static connect(options: Record<string,unknown>): void {
    if (Database.dataSource) {
      return;
    }
    // TODO Make proper instead of a scrappy typing on the fly
    const dataSource = new DataSource({
      type: options?.TYPE as 'mysql',
      name: options.NAME as string,
      host: options.HOST as string,
      port: options.PORT as number,
      username: options.USER as string,
      password: options.PWD as string,
      database: options.DB as string,
      entities: options.ENTITIES as [],
      subscribers: options.SUBSCRIBERS as [],
      synchronize: options.SYNC as boolean,
      logging: options.LOG as boolean,
      cache: options.CACHE as boolean
    });

    dataSource.initialize()
      .then(() => {
        Logger.log('info', `Connection to MySQL server established on port ${options.PORT as string} (${ENV})`);
        Database.dataSource = dataSource;
      })
      .catch((error: Error) => {
        process.stdout.write(`error: ${error.message}`);
        process.exit(1);
      });
  }
}