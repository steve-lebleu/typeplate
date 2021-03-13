import * as Express from 'express';

import { SSL, PORT } from '@config/environment.config';
import { readFileSync } from 'fs';
import { Server as HttpsServer, createServer } from 'https';

/**
 * @description
 */
export class ServerConfiguration {

  /**
   *
   */
  static options = {
    credentials: {
      key: SSL.IS_ACTIVE ? readFileSync(SSL.KEY, 'utf8') : null,
      cert: SSL.IS_ACTIVE ? readFileSync(SSL.CERT, 'utf8') : null,
    },
    port: PORT
  }

  /**
   * @description
   *
   * @param app Express application
   */
  static server(app: Express.Application): Express.Application|HttpsServer {
    return SSL.IS_ACTIVE ? createServer(ServerConfiguration.options.credentials, app) : app
  }
}
