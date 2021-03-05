// TODO: Finalize ESLint compliance
// TODO: Define roadmap
// TODO: Git flow, tags
// TODO: Email sending
// TODO: Serializing and JSONAPI support. Implements or remove
// TODO: Unit testing and coverage
// TODO: Refactoring testing, prettier fixtures
// TODO: Refactoring config files (especialy env), types files
// TODO: Modular architecture
// TODO: Better logs management. Adapt / add transports with Winston
// TODO: Jimp features
// TODO: Media fieldname management
// TODO: Fallback on upload -> delete file when data is not saved
// TODO: Media expose User critical data
// FIXME: Hooks husky
// FIXME: Jimp config must be splitted however IsActive is created as directory
// TODO: Manage changelog
// TODO: Update coverage path, impact ci/cd path
// TODO: Update doc api + typedoc. Set Api doc as link on Github ?
// TODO: Update npm dependencies

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
    Logger.log('info', `HTTP(S) server is now running on port ${port} (${env})`, { label: 'Server' } );
});

export { application, server };