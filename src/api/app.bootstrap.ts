require('module-alias/register');

import { TYPEORM } from '@config/environment.config';
import { TypeormConfiguration } from '@config/typeorm.config';
import { Server } from '@config/server.config';
import { Application } from '@config/express.config';

TypeormConfiguration.connect(TYPEORM)
  .catch( (e: Error) => {
    process.stdout.write(e.message);
    process.exit(1);
  });

const application = Application;
const server = Server.init(application).listen() as unknown;

export { application, server };