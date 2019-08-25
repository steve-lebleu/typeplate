require('module-alias/register');

/**
 *  
 * TODO: serialization in vnd+api mode
 * TODO: adapt package json buiding tasks
 * TODO: adapt validations and test cases for users
 * TODO: dev branch
 * TODO: TS lint
 * 
 */

import { MySQLServer } from "./server.mysql";

const dbServer = new MySQLServer();
dbServer.start();

import { ApplicationConfiguration } from "@config/app.config";
import { Server } from "./server.http";

const applicationConfig = new ApplicationConfiguration();

const server = new Server( applicationConfig.app );
server.start();

const exportWrappedHttpServerForTesting = server.server;
const exportWrappedExpressApplicationForTesting = applicationConfig.app;

export { exportWrappedExpressApplicationForTesting as application, exportWrappedHttpServerForTesting as server };