// FIXME: Jimp config must be splitted however IsActive is created as directory
// FIXME: Media expose User critical data

// TODO: Finalize ESLint compliance
// TODO: Email sending
// TODO: Serializing and JSONAPI support. Implements or remove
// TODO: Unit testing, coverage (dest path lcov) and refactoring, prettify fixtures
// TODO: Modular architecture
// TODO: Jimp features
// TODO: Media fieldname management
// TODO: Fallback on upload -> delete file when data is not saved
// TODO: Update doc api + typedoc. Set Api doc as link on Github ?
// TODO: Refactoring typing for more simplicity and consistence

// FIXME: Hooks husky
// TODO: Refactoring config files (especialy env)
// TODO: Define roadmap
// TODO: Manage changelog
// TODO: Update npm dependencies
// TODO: readme explain env variables

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
    } );

const application = new ExpressConfiguration( Express() ).get();
const HTTPServer = ServerConfiguration.server(application);

const server = HTTPServer.listen(port, () => {
    Logger.log('info', `HTTP(S) server is now running on port ${port} (${env})`);
});

export { application, server };