require('module-alias/register');

import * as Express from 'express';

import { ENV, PORT, TYPEORM } from '@config/environment.config';
import { TypeormConfiguration } from '@config/typeorm.config';
import { ServerConfiguration } from '@config/server.config';
import { ExpressConfiguration } from '@config/app.config';

import { Logger } from '@services/logger.service';

TypeormConfiguration.connect(TYPEORM)
  .catch( (e: Error) => {
    process.stdout.write(e.message);
    process.exit(1);
  });

const application = new ExpressConfiguration( Express() ).get();
const HTTPServer = ServerConfiguration.server(application);

const server = HTTPServer.listen(PORT, () => {
  Logger.log('info', `HTTP(S) server is now running on port ${PORT} (${ENV})`);
});

export { application, server };