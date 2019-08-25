import { ENVIRONMENT } from '@enums/environment.enum';
import { env, typeorm } from "@config/environment.config";
import { Connection } from 'typeorm';
import { TypeormConfiguration } from "@config/typeorm.config";
import { Container } from "@config/container.config";

/**
 * Database connection manager for MySQL server
 */
export class MySQLServer {

  /**
   * @description Stored typeorm connection
   */
  connection: Connection;

  constructor() {}

  /** 
   * @description Connection to MySQL database server
   **/
  start(): Promise<Connection> {
    return new Promise((resolve, reject) => {
      TypeormConfiguration.connect()
        .then( (connection) => {
          this.connection = connection;
          if(env !== ENVIRONMENT.test) {
            Container.resolve('Logger').log('info', `Connection to MySQL server established on port ${typeorm.port} (${env})`, { label: 'MySQL' });
          }
          resolve(connection);
        })
        .catch( (error) => { 
          if(env !== ENVIRONMENT.test) {
            Container.resolve('Logger').log('error', `MySQL connection error : ${error.message}`, { label: 'MySQL' });
          }
          reject(error.message)
        });
    });
  }
};