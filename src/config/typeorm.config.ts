import "reflect-metadata";

import { createConnection, Connection } from "typeorm";

import { Container } from "@config/container.config";
import { typeorm } from "@config/environment.config";

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
        type: "mysql",
        name: typeorm.name,
        host: typeorm.host,
        port: parseInt(typeorm.port,10),
        username: typeorm.user,
        password: typeorm.pwd,
        database: typeorm.database,
        entities: [ `${process.cwd()}/dist/api/models/**/*.js` ],
        synchronize: true,
        logging: false
      })
      .then( (connection: Connection) => { 
        resolve(connection); 
      })
      .catch( (error) => { 
        Container.resolve('Logger').log('error', error.message, { label: 'MySQL' }); 
        reject(error); 
      });
    });
  }
};