require('module-alias/register');

import { TYPEORM, ENV } from '@config/environment.config';
import { Logger } from '@services/logger.service';
import { ApplicationDataSource } from '@config/database.config';
import { Server } from '@config/server.config';

ApplicationDataSource.initialize()
  .then(() => {
    Logger.log('info', `Connection to MySQL server established on port ${TYPEORM.PORT} (${ENV})`);
  })
  .catch((error: Error) => {
    process.stdout.write(`error: ${error.message}`);
    process.exit(1);
  });

import { Application } from '@config/app.config';

const application = Application;
const server = Server.init(application).listen() as unknown;

export { application, server };