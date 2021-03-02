import * as Express from 'express';

import { ssl, port } from '@config/environment.config';
import { readFileSync } from 'fs';
import { Server as HttpsServer, createServer } from 'https';

export class ServerConfiguration {

    /**
     *
     */
    static options = {
        credentials: {
            key: ssl.isActive === 1 ? readFileSync(ssl.key, 'utf8') : null,
            cert: ssl.isActive === 1 ? readFileSync(ssl.cert, 'utf8') : null,
        },
        port
    }

    constructor() {}

    static server(app: Express.Application): Express.Application|HttpsServer {
        return ssl.isActive === 1 ? createServer(ServerConfiguration.options.credentials, app) : app
    }
}
