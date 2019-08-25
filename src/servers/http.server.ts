import { ENVIRONMENT } from "@enums/environment.enum";
import { env, ssl, port } from "@config/environment.config";

import * as Express from "express";
import * as https from "https";

import { readFileSync } from "fs";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";

import { Connection } from "typeorm";

import { Container } from "@config/container.config";
import { Application } from "@config/app.config";
import { MySQLServer } from "@servers/mysql.server";

/**
 * Application server wrapper instance
 */
export class Server {

  /**
   * 
   */
  http: HttpServer|HttpsServer;

  /**
   * 
   */
  db: MySQLServer;

  /**
   * 
   */
  app: Express.Application;

  /**
   * 
   */
  private options = {
    credentials: {
      key: ssl.isActive === 1 ? readFileSync(ssl.key, "utf8") : null,
      cert: ssl.isActive === 1 ? readFileSync(ssl.cert, "utf8") : null,
    },
    port: port
  }

  constructor() {
    this.db = new MySQLServer();
  }

  /**
   * @description Create HTTP server and listen dedicated port
   */
  createHttpServer(): HttpServer|HttpsServer {

    try {
      this.app = new Application().app;
      if(ssl.isActive === 1) {
        this.http = https
          .createServer(this.options.credentials, this.app)
          .listen(port, function() {
            if(env !== ENVIRONMENT.test) {
              Container.resolve('Logger').log('info', `HTTPS server is now running on port ${port} (${env})`, { label: 'Server' } );
            }
          });
      } else {
        this.http = this.app.listen( port, () => {
          if(env !== ENVIRONMENT.test) {
            Container.resolve('Logger').log('info', `HTTP server is now running on port ${port} (${env})`, { label: 'Server' } );
          }
        });
      }
      return this.http;
    } catch (error) { 
      Container.resolve('Logger').log('error', `Server creation error : ${error.message}`, { label: 'Server' } ); 
    } 
  }

  /**
   * @description Start servers
   */
  start() {
    this.db.start()
      .then( (connection: Connection) => {
        this.createHttpServer();
      })
      .catch( error => { Container.resolve('Logger').log('error', `Server starting error : ${error.message}`, { label: 'MySQL' } );  })
  }

}