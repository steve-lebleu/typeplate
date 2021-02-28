import { getConnection, Connection } from 'typeorm';
import { typeorm as TypeORM } from '@config/environment.config';

/**
 * Main controller contains properties/methods
 */
export abstract class Controller {

  /**
   * @description TypeORM current database connection
   */
  protected connection : Connection;

  constructor() {
 this.connection = getConnection(TypeORM.name);
}

}