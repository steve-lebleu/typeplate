![Typescript / Express / Typeorm REST API boilerplate](https://i.ibb.co/gSrfgS6/header-ts-boilerplate-3.png)

[![Node](https://img.shields.io/badge/Node-14.16.0-informational)](https://nodejs.org/docs/latest-v14.x/api/index.html)
[![TypeScript](https://img.shields.io/badge/Typescript-4.2.2-informational)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.16.4-informational)](https://expressjs.com/)
[![Typeorm](https://img.shields.io/badge/Typeorm-0.2.31-informational)](https://typeorm.io/#/)
[![Mocha](https://img.shields.io/badge/Mocha-8.0.3-informational)](https://mochajs.org)

[![Build Status](https://travis-ci.com/konfer-be/ts-express-typeorm-boilerplate.svg?token=DmbPFqq91BhwsJKVDsHw&branch=master)](https://travis-ci.com/konfer-be/ts-express-typeorm-boilerplate)
[![Coverage Status](https://coveralls.io/repos/github/konfer-be/ts-express-typeorm-boilerplate/badge.svg?branch=master&refresh=1)](https://coveralls.io/github/konfer-be/ts-express-typeorm-boilerplate?branch=master)
![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/konfer-be/ts-express-typeorm-boilerplate/master)
![Requires.io (branch)](https://img.shields.io/requires/github/konfer-be/ts-express-typeorm-boilerplate/master)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/konfer-be/ts-express-typeorm-boilerplate)

[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
![Discord](https://img.shields.io/discord/817108781291929641)

Small but badass RESTful API boilerplate builded with [Express.js](http://expressjs.com/en/4x/api.html), [Typescript](https://github.com/Microsoft/TypeScript)  [TypeORM](https://github.com/typeorm/typeorm) and [Mocha](https://mochajs.org/). 🤘

Thanks to [Daniel F. Sousa](https://github.com/danielfsousa) for the inspiration with [Express REST 2017 boilerplate](https://github.com/danielfsousa/express-rest-es2017-boilerplate). 🍺🍺🍺

## Table of contents

* [Features](#features)
* [Getting started](#getting-started)
* [Documentation](#documentation)
* [Tests](#tests)
* [Continuous integration](#continuous-integration)
* [Deployment](#deployment)
* [Roadmap](#roadmap)

## Features

### ORM

Object Relational Mapping with [Typeorm](https://typeorm.io/#/).

### Security

SSL secure connection support with native [HTTPS node module](https://nodejs.org/docs/latest-v14.x/api/https.html).

Classic security features with [CORS](https://expressjs.com/en/resources/middleware/cors.html), [Helmet](https://helmetjs.github.io/), [Hpp](https://www.npmjs.com/package/hpp) and [Express rate limit](https://www.npmjs.com/package/express-rate-limit).

### HTTP friendly errors

Customized error handling for clean and consistent HTTP friendly errors with [boom](https://github.com/hapijs/boom) and [http-status](https://www.npmjs.com/package/http-status).

### Logging

Simple logs management with [Morgan](https://github.com/expressjs/morgan) and [Winston](https://github.com/winstonjs/winston).

### Caching

Simple cache system with [memory-cache](https://www.npmjs.com/package/memory-cache) or [typeorm caching](https://github.com/typeorm/typeorm/blob/master/docs/caching.md).

### Authentication

Full authentication process with [passport.js](http://www.passportjs.org/) (Bearer, oauth Facebook, oauth Google).

### Validation

Route validation with [Joi](https://github.com/hapijs/joi).

### File upload

Configurable [Medias](https://github.com/konfer-be/ts-express-typeorm-boilerplate/blob/master/src/api/models/media.model.ts) and file upload with [Multer](https://www.npmjs.com/package/multer).

### Image resizing

Automatic and configurable image resizing designed for front-end requirements with [Jimp](https://www.npmjs.com/package/jimp).

### Changelog management

Automatic completion of the changelog with [auto-changelog](https://www.npmjs.com/package/auto-changelog).

### Testing

Unit and e2e tests with [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/) and [Supertest](https://github.com/visionmedia/supertest).

### Documentation

Easy generation of documentation with [api-doc](https://apidocjs.com/) and [typedoc](https://typedoc.org/).

## Getting started

### Install

```bash
$ git clone https://github.com/konfer-be/ts-express-typeorm-boilerplate.git your-project-name/
```

### Build

```bash
$ npm run kickstart
```

### Setup

#### Environments

First, fill required env variables in *./dist/env/development.env* and *./dist/env/test.env* files. Mandatory fields are uncommented in the files. See env variables list above for more informations.

| Key          | Description | Type    | Default     | Required |
| ------------ | ----------- | ----------- | ----------- | ---------- |
| API_VERSION  | Current version of your API | string | v1 | false
| **AUTHORIZED**   | Allowed client hosts | string | / | true
| CACHE_IS_ACTIVE | Cache activated | boolean | 0 | false
| CACHE_TYPE | Cache type | enum | MEMORY | false
| CACHE_LIFETIME | Cache lifetime duration (ms) | number | 5000 | false
| CONTENT_TYPE | Supported Content-Type | string | application/json | false
| **DOMAIN** | API domain | string | localhost | true
| HTTPS_IS_ACTIVE | SSL support activated | boolean | 0 | false
| HTTPS_CERT | SSL certificate path | string | / | false
| HTTPS_KEY | Private key path | string | / | false
| JWT_EXPIRATION_MINUTES   | JWT lifetime (minutes) | number | 120960 | false
| **JWT_SECRET**   | JWT secret passphrase | string | / | true
| LOGS_MORGAN_TOKEN | Morgan logs format | string | dev | false
| LOGS_PATH    | Logs directory path | string | logs | false
| **PORT**         | Listened application port | number | / | true
| RESIZE_IS_ACTIVE | Images resizing activated | boolean | 1 | false
| RESIZE_PATH_MASTER | Images directory name | string | master-copy | false
| RESIZE_PATH_SCALE | Resized images path | string | rescale | path
| RESIZE_SIZE_XS | Extra-small size value (px) | number | 260 | false
| RESIZE_SIZE_SM | Small size value (px) | number | 320 | false
| RESIZE_SIZE_MD | Medium size value (px) | number | 768 | false
| RESIZE_SIZE_LG | Large size value (px) | number | 1024 | false
| RESIZE_SIZE_XL | Extra-large size value (px) | number | 1366 | false
| **TYPEORM_TYPE** | Database engine | string | / | true
| TYPEORM_NAME | Databse connection identifier | string | default | false
| **TYPEORM_HOST** | Database server host | string | / | true
| **TYPEORM_DB**   | Database name | string | / | true
| **TYPEORM_USER** | Database user | string | / | true
| **TYPEORM_PWD**  | Database password | string | / | true
| **TYPEORM_PORT** | Database server port | number | / | true
| TYPEORM_SYNC | Schema synchronization activated | boolean | 0 | false
| TYPEORM_LOG  | Queries logs activated | boolean | 0 | false
| UPLOAD_PATH  | Destination path for uploads | string | public | false
| UPLOAD_MAX_FILE_SIZE | Max file size (bytes) | number | 1000000 | false
| UPLOAD_MAX_FILES | Max number of files per request | number | 5 | false
| UPLOAD_WILDCARDS | Accepted file types for upload | string | * | false

#### Typescript

Typescript configuration is provided in *./tsconfig.json* file:

```javascript
{
  "compilerOptions": {
    "outDir": "./dist/api",
    "sourceMap": false,
    "baseUrl": "./src",
    "paths": {
      "@bases/*": ["api/types/classes/*"],
      "@config/*": ["api/config/*"],
      "@controllers/*": ["api/controllers/*"],
      "@decorators/*": ["api/decorators/*"],
      "@enums/*": ["api/types/enums/*"],
      "@errors/*": ["api/types/errors/*"],
      "@events/*": ["api/events/*"],
      "@factories/*": ["api/factories/*"],
      "@interfaces/*": ["api/types/interfaces/*"],
      "@middlewares/*": ["api/middlewares/*"],
      "@models/*": ["api/models/*"],
      "@repositories/*": ["api/repositories/*"],
      "@routes/*": ["api/routes/v1/*"],
      "@serializers/*": ["api/serializers/*"],
      "@servers/*": ["servers/*"],
      "@services/*": ["api/services/*"],
      "@utils/*": ["api/utils/*"],
      "@validations/*": ["api/validations/*"],
      "@whitelists/*": ["api/serializers/whitelists/*"]
    },
    "lib": ["dom", "es5", "es6", "es7"],
    "target": "es5",
    "module": "commonjs",
    "allowSyntheticDefaultImports": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
  },
  "exclude" : [
    "**/**/node_modules",
    "node_modules"
  ]
}
```

If you don't wish specify particular Typescript settings, skip this step.

More info about [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

#### TypeORM

If you will use Typeorm as CLI, you must update *ormconfig.json* file, and fill it with the same parameters as in your environment file.

```javascript
{
  "type": "mysql",
  "name": "default",
  "host": "localhost",
  "port": 3306,
  "username": "root",
  "password": "root",
  "database": "your-database",
  "synchronize": false,
  "logging": false,
  "entities": [
    "./dist/api/models/**/*.js"
  ],
  "migrations": [
    "./dist/migrations/**/*.js"
  ],
  "subscribers": [
    "dist/api/models/subscribers/**/*.subscriber.js"
  ],
  "cli": {
    "entitiesDir": "./dist/api/models",
    "migrationsDir": "./dist/migrations",
    "subscribersDir": "./dist/api/models/subscribers"
  }
}
```

If you don't wish to use Typeorm with CLI, skip this step.

More info about [ormconfig file](http://typeorm.io/#/using-ormconfig) and [typeorm cli](https://typeorm.io/#/using-cli/installing-cli).

### Compile

```bash
$ tsc
```

### Run

Enjoy with:

```bash
$ nodemon
```

## Documentation

```bash
$ npm run doc:apidoc
```

Generate API documentation website into *./docs/apidoc/*.

See [apidoc](http://apidocjs.com/) for more informations about customization.

```bash
$ npm run doc:typedoc
```

Generate code documentation website into *./docs/typedoc/*.

See [typedoc](https://typedoc.org/) for more informations about customization.

```bash
$ npm run doc
```

Generate api and code documentation websites into *./docs/*.

## Tests

```bash
$ npm run test --env test
```

HTML coverage report is generated by [Istanbul](https://github.com/gotwarlost/istanbul) in *./reports/nyc-coverage*.

Bonus with *./insomnia.workspace.json* if you wish run manual e2e tests without create the config.

## Continuous integration

Basic Travis-CI configuration is provided in *./.travis.yml* file.

## Deployment

Project implements a basic [PM2](https://github.com/Unitech/PM2/) configuration to allow easy deployment.

First, install PM2 globaly :

```bash
$ npm i pm2 -g
```

Note that PM2 should also be installed on other server environments, and that your SSH public key must be granted by the destination server.

### Configuration

Configure the *ecosystem.config.js* file with your environments informations.

```javascript
deploy : {
  staging : {
    path : 'path-to-your-SSH-public-key',
    user : 'node',
    host : '212.83.163.1',
    ref  : 'origin/master',
    repo : 'git@github.com:repo.git',
    path : '/var/www/staging',
    'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env staging'
  },
  production : {
    path : 'path-to-your-SSH-public-key',
    user : 'node',
    host : '212.83.163.1',
    ref  : 'origin/master',
    repo : 'git@github.com:repo.git',
    path : '/var/www/production',
    'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
  }
}
```
More info about PM2 [ecosystem.config.js](https://pm2.io/doc/en/runtime/reference/ecosystem-file/) file.

### Deploy

```bash
# Setup deployment at remote location
$ pm2 deploy production setup

# Update remote version
$ pm2 deploy production update

# Revert to -1 deployment
$ pm2 deploy production revert 1

# execute a command on remote servers
$ pm2 deploy production exec "pm2 reload all"
```

More info about [PM2 deploy](https://pm2.io/doc/en/runtime/guide/easy-deploy-with-ssh/).

More info about [PM2](http://pm2.keymetrics.io/docs/usage/quick-start/).

## Roadmap

- [ ] Fixme's and todo's
- [ ] Services
  - [ ] Permissions
  - [ ] Business
  - [ ] Data layer
- [ ] Modular, scalable & consistent architecture
- [ ] Unit testing
  - [ ] 95% coverage
  - [x] Refactoring UT, split e2e testing
  - [x] Pretty fixtures
  - [x] Dest path lcov (~~docs~~)
- [ ] ESLint compliance
- [ ] PM2 deployment and configuration
- [ ] API monitoring
- [ ] Wiki
- [ ] Generating (Typeorm cli and kem)
- [ ] Clean doc generation. Set Api doc as demo
- [ ] Oauth twitter, github, linkedin
- [ ] Email sending
- [ ] Graphql support
- [ ] CI providers (circle-ci at least)