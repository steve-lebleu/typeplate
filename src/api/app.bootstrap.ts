require('module-alias/register');

import * as Express from 'express';

import { env, port} from '@config/environment.config';
import { TypeormConfiguration } from '@config/typeorm.config';
import { ServerConfiguration } from '@config/server.config';
import { ExpressConfiguration } from '@config/app.config';

import { Logger } from '@services/logger.service';

TypeormConfiguration.connect()
  .catch( (e: Error) => {
    throw new Error(e.message);
  });

const application = new ExpressConfiguration( Express() ).get();
const HTTPServer = ServerConfiguration.server(application);

const server = HTTPServer.listen(port, () => {
  Logger.log('info', `HTTP(S) server is now running on port ${port} (${env})`);
});

export { application, server };