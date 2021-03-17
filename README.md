![Typescript / Express / Typeorm REST API boilerplate](https://i.ibb.co/tbqXm9Q/header-ts-boilerplate-4.png)

[![Build Status](https://travis-ci.com/konfer-be/ts-express-typeorm-boilerplate.svg?token=DmbPFqq91BhwsJKVDsHw&branch=master)](https://travis-ci.com/konfer-be/ts-express-typeorm-boilerplate)
[![Coverage Status](https://coveralls.io/repos/github/konfer-be/ts-express-typeorm-boilerplate/badge.svg?branch=master)](https://coveralls.io/github/konfer-be/ts-express-typeorm-boilerplate?branch=master)
![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/konfer-be/ts-express-typeorm-boilerplate/master)
![Requires.io (branch)](https://img.shields.io/requires/github/konfer-be/ts-express-typeorm-boilerplate/master)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/konfer-be/ts-express-typeorm-boilerplate)

[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

Small but badass & ready to use RESTful API boilerplate builded with [Express.js](http://expressjs.com/en/4x/api.html), [Typescript](https://github.com/Microsoft/TypeScript)  [TypeORM](https://github.com/typeorm/typeorm) and [Mocha](https://mochajs.org/). 🤘

## > Features

* **Clear code architecture** with classic layers such controllers, services, repositories, models, ...
* **Object Relational Mapping** with [Typeorm](https://typeorm.io/#/).
* **SSL secure connection** with native [HTTPS node module](https://nodejs.org/docs/latest-v14.x/api/https.html).
* **Cross Oigin Resource Sharing** with [CORS](https://expressjs.com/en/resources/middleware/cors.html).
* **Securized HTTP headers** with [Helmet](https://helmetjs.github.io/).
* **HTTP header pollution** preventing with [Hpp](https://www.npmjs.com/package/hpp).
* **API request rate limit** with [Express rate limit](https://www.npmjs.com/package/express-rate-limit).
* **HTTP friendly errors** based on a custom pipe with [boom](https://github.com/hapijs/boom) and [http-status](https://www.npmjs.com/package/http-status).
* **Logs management** with [Morgan](https://github.com/expressjs/morgan) and [Winston](https://github.com/winstonjs/winston).
* **HTTP request cache** with [memory-cache](https://www.npmjs.com/package/memory-cache).
* **Database query cache** with [typeorm caching](https://github.com/typeorm/typeorm/blob/master/docs/caching.md).
* **JWT authentication process** with [passport.js](http://www.passportjs.org/).
* **oAuth authentication process** with [passport.js](http://www.passportjs.org/).
* **Route validation** with [Joi](https://github.com/hapijs/joi).
* **Customizable file upload** with [Multer](https://www.npmjs.com/package/multer).
* **Customizable image resizing** designed for front-end requirements with [Jimp](https://www.npmjs.com/package/jimp).
* **Automatic changelog completion** with [auto-changelog](https://www.npmjs.com/package/auto-changelog).
* **Easy API testing** with included unit and e2e test sets builded with [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/), [Sinon](https://sinonjs.org/) and [Supertest](https://github.com/visionmedia/supertest).
* **Easy generation of documentation** with [api-doc](https://apidocjs.com/) and [typedoc](https://typedoc.org/). 

## > Table of contents

* [Getting started](#getting-started)
* [Documentation](#documentation)
* [Tests](#tests)
* [Continuous integration](#continuous-integration)
* [Deployment](#deployment)
* [Licence](#licence)

## > Getting started

### Prerequisites

Before start, following technologies are required:

* Git engine
* Node.js >= 14.16.0
* NPM or yarn
* A database engine with dedicated user and database

When you're ready with that, starting your project is a matter of minutes.

### Step 1: install

```bash
$ git clone https://github.com/konfer-be/ts-express-typeorm-boilerplate.git path-to/your-project-name/
```

### Step 2: go to your project

```bash
$ cd path-to/your-project-name/
```

### Step 3: build

```bash
$ npm run kickstart
```

### Step 4: setup git

```bash
$ rm -rf ./.git && git init && git add . --all && git commit -m "First commit"
```

### Step 5: setup package.json

Open the *./package.json* file and edit *version*, *author*, *name*, *description*, *homepage*, *repository* and *bugs* fields with your own values.

### Step 6: setup environment variables

Environment variables are defined in *.env* files. Open *./dist/env/development.env* and fill the required values (uncommented in the file). See [env variables list](https://github.com/konfer-be/ts-express-typeorm-boilerplate/wiki/Environment-variables) for more informations.

```bash
# CORS authorized domains
AUTHORIZED = "http://localhost:4200"

# API domain
DOMAIN = "localhost"

# JWT Secret passphrase
JWT_SECRET = "bA2xcjpf8y5aSUFsNB2qN5yymUBSs6es3qHoFpGkec75RCeBb8cpKauGefw5qy4"

# Application port.
PORT = 8101

# Database engine
TYPEORM_TYPE = "mysql"

# Database server host
TYPEORM_HOST = "localhost"

# Database name. Keep it different from your developement database.
TYPEORM_DB = "ts_express_boilerplate_test"

# Database user
TYPEORM_USER = "root"

# Database password
TYPEORM_PWD = ""

# Database port
TYPEORM_PORT = "3306"
```

### Step 7: setup your Typescript environment

If you don't wish specify particular Typescript settings, skip this step.

Otherwise, Typescript configuration is provided in *./tsconfig.json* file:

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
      "@factories/*": ["api/factories/*"],
      "@interfaces/*": ["api/types/interfaces/*"],
      "@middlewares/*": ["api/middlewares/*"],
      "@models/*": ["api/models/*"],
      "@repositories/*": ["api/repositories/*"],
      "@routes/*": ["api/routes/v1/*"],
      "@servers/*": ["servers/*"],
      "@services/*": ["api/services/*"],
      "@utils/*": ["api/utils/*"],
      "@validations/*": ["api/validations/*"],
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

More info about [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

### Step 8: setup Typeorm cli

If you don't wish to use Typeorm with CLI, skip this step.

Otherwise, update *./ormconfig.json* file, and fill it with the same parameters as in your environment file.

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

More info about [ormconfig file](http://typeorm.io/#/using-ormconfig) and [typeorm cli](https://typeorm.io/#/using-cli/installing-cli).

### Step 9: compile

```bash
$ tsc
```

### Step 10: run & enjoy

```bash
$ nodemon
```

## > Documentation

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

## > Tests

```bash
$ npm run test --env test
```

HTML coverage report is generated by [Istanbul](https://github.com/gotwarlost/istanbul) in *./reports/nyc-coverage*.

Bonus with *./insomnia.workspace.json* if you wish run manual e2e tests without create the config.

## > Continuous integration

Basic Travis-CI configuration is provided in *./.travis.yml* file.

## > Deployment

Project implements a basic [PM2](https://github.com/Unitech/PM2/) configuration to allow easy deployment.

First, install PM2 globaly :

```bash
$ npm i pm2 -g
```

### Configuration

Configure the *./ecosystem.config.js* file with your environments informations.

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

Pm 2 must be installed on the target server and your SSH public key granted.

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

More info about [PM2](http://pm2.keymetrics.io/docs/usage/quick-start/) and [PM2 deploy](https://pm2.io/doc/en/runtime/guide/easy-deploy-with-ssh/).

## > License

[MIT](/LICENSE)