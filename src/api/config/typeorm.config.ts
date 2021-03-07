import 'reflect-metadata';

import { createConnection, Connection } from 'typeorm';
import { env, typeorm } from '@config/environment.config';
import { Logger } from '@services/logger.service';
import { DATABASE_ENGINE } from '@enums/database-engine.enum';

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
        type: DATABASE_ENGINE[typeorm.type],
        name: typeorm.name,
        host: typeorm.host,
        port: typeorm.port,
        username: typeorm.user,
        password: typeorm.pwd,
        database: typeorm.database,
        entities: [ typeorm.entities ],
        synchronize: true,
        logging: false
      })
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