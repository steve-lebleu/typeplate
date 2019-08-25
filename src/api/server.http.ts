import { ENVIRONMENT } from "@enums/environment.enum";
import { env, ssl, port } from "@config/environment.config";

import * as Express from "express";
import * as fs from "fs";
import * as https from "https";

import { Container } from "@config/container.config";

import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";

/**
 * @class Server
 * @description Application server wrapper instance
 */
export class Server {

  public server: HttpServer|HttpsServer;

  public app: Express.Application;

  private options = {
    credentials: {
      key: ssl.isActive === 1 ? fs.readFileSync(ssl.key, "utf8") : null,
      cert: ssl.isActive === 1 ? fs.readFileSync(ssl.cert, "utf8") : null,
    },
    port: port
  }

  constructor(app: Express.Application) {
    this.app = app;
  }

  start(): HttpServer|HttpsServer {
    try {
      if(ssl.isActive === 1) {
        this.server = https
          .createServer(this.options.credentials, this.app)
          .listen(port, function() {
            if(env !== ENVIRONMENT.test) {
              Container.resolve('Logger').log('info', `HTTPS server is now running on port ${port} (${env})`, { label: 'Server' } );
            }
          });
      } else {
        this.server = this.app.listen( port, () => {
          if(env !== ENVIRONMENT.test) {
            Container.resolve('Logger').log('info', `HTTP server is now running on port ${port} (${env})`, { label: 'Server' } );
          }
        });
      }
      return this.server;
    } catch (error) { 
      Container.resolve('Logger').log('error', `Server creation error : ${error.message}`, { label: 'Server' } ); 
    } 
  }

}