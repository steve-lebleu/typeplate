import { ENVIRONMENT } from '@enums/environment.enum';
import { env, typeorm } from "@config/environment.config";

import { TypeormConfiguration } from "@config/typeorm.config";
import { Connection } from 'typeorm';
import { Container } from "@config/container.config";

/**
 * @class MySQLServer
 * @description Database connection manager for MySQL server
 */
export class MySQLServer {

  /**
   * @description Stored typeorm connection
   */
  public connection: Connection;

  constructor() {}

  /** 
   * @description Connection to MySQL database server
   **/
  start(): void {
    TypeormConfiguration.connect()
      .then( (connection) => {
        this.connection = connection;
        if(env !== ENVIRONMENT.test) {
          Container.resolve('Logger').log('info', `Connection to ${typeorm.type} server established on port ${typeorm.port} (${env})`, { label: 'MySQL' });
        }
      })
      .catch( (error) => { 
        if(env !== ENVIRONMENT.test) {
          Container.resolve('Logger').log('error', `MySQL connection error : ${error.message}`, { label: 'MySQL' });
        }
      });
  }
};