require('module-alias/register');

import * as Express from "express";

import { env, port} from "@config/environment.config";
import { TypeormConfiguration } from "@config/typeorm.config";
import { ServerConfiguration } from "@config/server.config";
import { ExpressConfiguration } from '@config/app.config';
import { Container } from "@config/container.config";

TypeormConfiguration.connect().catch( (e: Error) => { throw new Error(e.message) } );

const application = new ExpressConfiguration( Express() ).get();
const server = ServerConfiguration.server(application);

server.listen(port, function() {
    Container.resolve('Logger').log('info', `HTTP(S) server is now running on port ${port} (${env})`, { label: 'Server' } );
});

export { application, server };