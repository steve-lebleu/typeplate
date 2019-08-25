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

import { Server } from "@servers/http.server";

const server = new Server();
server.start();

const wrappedHttpServerForTesting = server.http;
const wrappedApplicationForTesting = server.app;

export { wrappedApplicationForTesting as application, wrappedHttpServerForTesting as server };