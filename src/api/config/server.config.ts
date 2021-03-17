import { readFileSync } from 'fs';
import { Server as HTTPServer, createServer } from 'https';
import { Application } from 'express';

import { ENV, SSL, PORT } from '@config/environment.config';

import { Logger } from '@services/logger.service';

/**
 * @description
 */

export class ServerConfiguration {

  private static instance: ServerConfiguration;

  /**
   * @description
   */
  private options = {
    credentials: {
      key: SSL.IS_ACTIVE ? readFileSync(SSL.KEY, 'utf8') : null,
      cert: SSL.IS_ACTIVE ? readFileSync(SSL.CERT, 'utf8') : null,
    },
    port: PORT
  }

  /**
   * @description
   */
  private server: Application|HTTPServer

  private constructor() {}

  /**
   * @description
   */
  static get(): ServerConfiguration {
    if (!ServerConfiguration.instance) {
      ServerConfiguration.instance = new ServerConfiguration();
    }
    return ServerConfiguration.instance;
  }

  /**
   * @description
   *
   * @param app Express application
   */
  init(app: Application): ServerConfiguration {
    this.server = !this.server ? SSL.IS_ACTIVE ? createServer(this.options.credentials, app) : app : this.server;
    return this;
  }

  /**
   * @description
   */
  listen(): any {
    const port = SSL.IS_ACTIVE ? 443 : PORT;
    const protocol = SSL.IS_ACTIVE ? 'HTTPS' : 'HTTP';
    return this.server.listen(port, () => {
      Logger.log('info', `${protocol} server is now running on port ${port} (${ENV})`);
    });
  }
}

const Server = ServerConfiguration.get();

export { Server }