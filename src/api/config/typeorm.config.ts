import 'reflect-metadata';

import { createConnection, Connection } from 'typeorm';
import { env, typeorm } from '@config/environment.config';
import { Logger } from '@services/logger.service';

/**
 * Typeorm default configuration
 *
 * @see https://http://typeorm.io
 */
export class TypeormConfiguration {

  constructor () { }

  /**
   * @description Connect to MySQL server
   * @async
   */
  static async connect(): Promise<Connection> {
    return new Promise( (resolve, reject) => {
      createConnection({
        type: 'mysql', /* FIXME: use enum */
        name: typeorm.name,
        host: typeorm.host,
        port: typeorm.port,
        username: typeorm.user,
        password: typeorm .pwd,
        database: typeorm.database,
        entities: [ typeorm.entities ],
        subscribers: [ typeorm.subscribers ],
        synchronize: typeorm.sync,
        logging: typeorm.log,
        cache: typeorm.cache
      } as any)
      .then( (connection: Connection) => {
        Logger.log('info', `Connection to MySQL server established on port ${typeorm.port} (${env})`);
        resolve(connection);
      })
      .catch( (error: Error) => {
        Logger.log('error', error.message);
        reject(error);
      });
    });
  }
}