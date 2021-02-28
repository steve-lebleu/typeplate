require('module-alias/register');

import { TypeormConfiguration } from "@config/typeorm.config";
import { Application } from '@config/app.config';
import { HTTPServer } from '@servers/http.server';

TypeormConfiguration.connect().catch((e: Error) => { throw new Error(e.message) });

const application = new Application();
const httpServer = new HTTPServer(application.app);

httpServer.start();

const wrappedHttpServer = httpServer.http;
const wrappedApplication = application.app;

export { wrappedApplication as application, wrappedHttpServer as server };