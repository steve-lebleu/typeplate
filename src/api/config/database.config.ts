import 'reflect-metadata';

import { createConnection, Connection } from 'typeorm';
import { ENV } from '@config/environment.config';
import { Logger } from '@services/logger.service';

/**
 * Typeorm default configuration
 *
 * @see https://http://typeorm.io
 */
export class Database {

  constructor () { }

  /**
   * @description Connect to MySQL server
   * @async
   */
  static async connect(options: Record<string,unknown>): Promise<Connection> {
    return new Promise( (resolve, reject) => {
      createConnection({
        type: options.TYPE,
        name: options.NAME,
        host: options.HOST,
        port: options.PORT,
        username: options.USER,
        password: options.PWD,
        database: options.DB,
        entities: [ options.ENTITIES ],
        subscribers: [ options.SUBSCRIBERS ],
        synchronize: options.SYNC,
        logging: options.LOG,
        cache: options.CACHE
      } as any)
      .then( (connection: Connection) => {
        Logger.log('info', `Connection to MySQL server established on port ${options.PORT as string} (${ENV})`);
        resolve(connection);
      })
      .catch( (error: Error) => {
        Logger.log('error', error.message);
        reject(error);
      });
    });
  }
}