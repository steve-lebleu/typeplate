import 'reflect-metadata';

import { DataSource, MixedList } from 'typeorm';
import { TYPEORM } from '@config/environment.config';

/**
 * Typeorm default configuration
 *
 * @see https://http://typeorm.io
 */
const ApplicationDataSource = new DataSource({
  type: TYPEORM?.TYPE as 'mariadb' | 'mysql',
  name: TYPEORM.NAME,
  host: TYPEORM.HOST,
  port: TYPEORM.PORT,
  username: TYPEORM.USER,
  password: TYPEORM.PWD,
  database: TYPEORM.DB,
  entities: TYPEORM.ENTITIES as unknown as MixedList<string>,
  subscribers: TYPEORM.SUBSCRIBERS as unknown as MixedList<string>,
  synchronize: TYPEORM.SYNC,
  logging: TYPEORM.LOG,
  cache: TYPEORM.CACHE
});


export default new DataSource({
  type: TYPEORM?.TYPE as 'mariadb' | 'mysql',
  name: TYPEORM.NAME,
  host: TYPEORM.HOST,
  port: TYPEORM.PORT,
  username: TYPEORM.USER,
  password: TYPEORM.PWD,
  database: TYPEORM.DB,
  entities: TYPEORM.ENTITIES as unknown as MixedList<string>,
  subscribers: TYPEORM.SUBSCRIBERS as unknown as MixedList<string>,
  synchronize: TYPEORM.SYNC,
  logging: TYPEORM.LOG,
  cache: TYPEORM.CACHE
});