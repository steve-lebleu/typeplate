import 'reflect-metadata';

import { DataSource } from 'typeorm';

/**
 * Typeorm default configuration used by CLI. This one is the new ormconfig.json
 *
 * @see https://http://typeorm.io
 */
export const dataSource = new DataSource({
  type: 'mysql',
  name: 'default',
  host: process.env.CI_DB_HOST || 'localhost',
  port: 3306,
  username: process.env.CI_DB_USER || 'root',
  password: process.env.CI_DB_PWD || 'passw0rd',
  database: process.env.CI_DB_NAME || 'typeplate_test',
  entities: [
    'dist/api/core/models/**/*.model.js',
    'dist/api/resources/**/*.model.js'
  ],
  migrations: [
    'dist/migrations/**/*.js'
  ],
  subscribers: [
    'dist/api/core/subscribers/**/*.subscriber.js',
    'dist/api/resources/**/*.subscriber.js'
  ],
  synchronize: false,
  logging: false,
  cache: false
});