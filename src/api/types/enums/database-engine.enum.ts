/**
 * @description Define supported database engines
 */
enum DATABASE_ENGINE {
  'mysql' = 'mysql',
  'mariadb' = 'mariadb',
  'postgres' = 'postgres',
  'cockroachdb' = 'cockroachdb',
  'sqlite' = 'sqlite',
  'mssql' = 'mssql',
  'sap' = 'sap',
  'oracle' = 'oracle',
  'cordova' = 'cordova',
  'nativescript' ='nativescript',
  'react-native' = 'react-native',
  'sqljs' = 'sqljs',
  'mongodb' = 'mongodb',
  'aurora-data-api' = 'aurora-data-api',
  'aurora-data-api-pg' = 'aurora-data-api-pg',
  'expo' = 'expo',
  'better-sqlite3' = 'better-sqlite3'
}

type DATABASE = 'mysql' | 'mariadb' | 'postgres' | 'cockroachdb' | 'sqlite' |'mssql' | 'sap' | 'oracle' | 'nativescript' | 'react-native' | 'sqljs' | 'mongodb' | 'aurora-data-api' | 'aurora-data-api-pg' | 'expo' | 'better-sqlite3';

export { DATABASE, DATABASE_ENGINE }