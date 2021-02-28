# Typescript / Express.js / Typeorm RESTful API boilerplate

[![Node](https://img.shields.io/badge/Node-14.16.0-green)](https://nodejs.org/docs/latest-v14.x/api/index.html)
[![TypeScript](https://img.shields.io/badge/Typescript-4.2.2-blue)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.16.4-lightgrey)](https://expressjs.com/fr/)
[![Typeorm](https://img.shields.io/badge/Typeorm-0.2.31-orange)](https://typeorm.io/#/)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

[![Build Status](https://travis-ci.com/konfer-be/ts-express-typeorm-boilerplate.svg?token=DmbPFqq91BhwsJKVDsHw&branch=master)](https://travis-ci.com/konfer-be/ts-express-typeorm-boilerplate)
[![Coverage](https://img.shields.io/badge/coverage-88.35%25-green)](https://github.com/konfer-be/ts-express-typeorm-boilerplate)
[![Known Vulnerabilities](https://snyk.io/test/github/konfer-be/ts-express-typeorm-boilerplate/badge.svg?style=plastic)](https://snyk.io/test/github/konfer-be/ts-express-typeorm-boilerplate)

Scalable RESTful API boilerplate [Express.js](http://expressjs.com/en/4x/api.html), [Typescript](https://github.com/Microsoft/TypeScript) and [TypeORM](https://github.com/typeorm/typeorm) based.

Thanks to [Daniel F. Sousa](https://github.com/danielfsousa) for the inspiration with [Express REST 2017 boilerplate](https://github.com/danielfsousa/express-rest-es2017-boilerplate).

## Table of contents

* [Features](#features)
  * [Authentication](#authentication)
  * [File upload](#file-upload)
  * [Validation](#validation)
  * [Security](#security)
  * [Entity generation](#entity-generation)
* [Getting started](#getting-started)
  * [Install](#install)
  * [Build](#build)
  * [Setup](#setup)
    * [Typescript](#typescript)
    * [TypeORM](#typeorm)
  * [Compile](#compile)
  * [Run](#run)
* [Tests](#tests)
* [Documentation](#documentation)
* [Continuous integration](#continuous-integration)
* [Deployment](#deployment)

## Features

A lot of parameters are setted/plugged in the [Application](https://github.com/konfer-be/ts-express-typeorm-boilerplate/blob/master/src/config/app.config.ts) config file. Heavier configurations are maked in dedicated config. 

### Authentication

Full authentication process is principaly based on [passport.js](http://www.passportjs.org/).

* **Implemented strategies**: Bearer, oauth Facebook, oauth Google
* **Token lifetime/secret**: see .env files

### File upload

Files can be managed as [Documents](https://github.com/konfer-be/ts-express-typeorm-boilerplate/blob/master/src/api/models/document.model.ts) entities, and are uploaded
with [Uploader](https://github.com/konfer-be/ts-express-typeorm-boilerplate/blob/master/src/api/middlewares/uploader.middleware.ts) middleware.

The middleware use [Multer](https://www.npmjs.com/package/multer) and [Jimp](https://www.npmjs.com/package/jimp), and provide following features:

* Document creation
* Single upload
* Multiple uploads
* Image resizing

You can set upload options from scratch on each route, or by default in .env files. By default, upload middleware is only plugged on [document router](https://github.com/konfer-be/ts-express-typeorm-boilerplate/blob/master/src/api/routes/v1/document.route.ts), but it can be used on other routes whitout difficult, with or without Document creation.

### Validation

Route validation is implemented with [express-validator](https://github.com/express-validator/express-validator), [express-validation](https://www.npmjs.com/package/express-validation) and [Joi](https://github.com/hapijs/joi).

One entity, one validation file.

You can define your own globals validation settings in dedicated [config file](https://github.com/konfer-be/ts-express-typeorm-boilerplate/blob/master/src/config/validation.config.ts). This file wrap express-validator and provide it to the validation middleware, which is used on routes to validate.

### Security

Some classic features are implemented with [CORS](https://expressjs.com/en/resources/middleware/cors.html), [Helmet](https://helmetjs.github.io/), [Hpp](https://www.npmjs.com/package/hpp) and [Express rate limit](https://www.npmjs.com/package/express-rate-limit).





### Entity generation

The boilerplate provide a basic entity generator (kfr-kem), which be used as cli tool. This generate following files :

* Controller
* Model 
* Repository
* Validation 
* Route
* Test
* Serializer
* Whitelist

To use the file generation, run the following command :

```bash
$ kem
```

First, the prompt ask you local folder destination, and check if the directory exists. Please, provide absolute root folder path of the project (ie /var/www/my-project).

Next, you will enter the name of the entity to generate. You can provide one or many words separated by spaces, generator will use hyphens for filename, and PascalCase for entity name.

Generated files contains only basic features and some parts must be filled by yourself :

* **Container**: The dependencies container must be updated with the controller. At least one.
* **Proxy-router**: The proxy-router service must be updated with the created router. 
* **Model**: model is filled with a primary auto-incremented id, and date system columns. Fill it with your columns and relations.
* **Serializer**: attributes as empty by default. Fill it with your entity attributes.
* **Validation rules**: body rules are created but empty by default. Fill it with your rules.

## Getting started

### Install

Clone boilerplate :

```bash
$ git clone https://github.com/konfer-be/ts-express-typeorm-boilerplate.git your-project-name/
```

### Build

Give kickstart :

```bash
$ npm run kickstart
```

This will install Typescript, Typeorm and Kem (cli entity generator) globaly, NPM packages, create *dist* directory and sub-directories, and run a one shot compilation.

### Setup

#### Typescript

You can adapt Typescript configuration in *./tsconfig.json* file :

```javascript
{
  "compilerOptions": {
    "outDir": "./dist/",
    "sourceMap": false,
    "baseUrl": "./src",
    "paths": {
      "@bases/*": ["api/types/classes/*"],
      "@config/*": ["config/*"],
      "@controllers/*": ["api/controllers/*"],
      "@enums/*": ["api/types/enums/*"],
      "@errors/*": ["api/types/errors/*"],
      "@interfaces/*": ["api/types/interfaces/*"],
      "@middlewares/*": ["api/middlewares/*"],
      "@models/*": ["api/models/*"],
      "@repositories/*": ["api/repositories/*"],
      "@routes/*": ["api/routes/v1/*"],
      "@serializers/*": ["api/serializers/*"],
      "@services/*": ["api/services/*"],
      "@utils/*": ["api/utils/*"],
      "@validations/*": ["api/validations/*"],
      "@whitelists/*": ["api/serializers/whitelists/*"]
    },
    "lib": ["dom", "es5", "es6", "es7"],
    "target": "es2017",
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

#### TypeORM

Update *.env* files (development, staging, production, test) with your own settings :

```env
# TypeORM
TYPEORM_TYPE = "mysql"
TYPEORM_NAME = "default"
TYPEORM_HOST = "localhost"
TYPEORM_DB = "your-database-name"
TYPEORM_USER = "root"
TYPEORM_PWD = "root"
TYPEORM_PORT = "3306"
TYPEORM_SYNC = 0
TYPEORM_LOG = 0
```

If you will use Typeorm as CLI, update also the *ormconfig.json* file and fill it with your own configuration :

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
  "cli": {
    "migrationsDir": "./dist/migrations",
    "subscribersDir": "./dist/subscribers"
  },
  "subscribers": [
    "src/subscribers/**/*.ts"
  ]
}
```

More info about [ormconfig file](http://typeorm.io/#/using-ormconfig) and [typeorm cli](https://typeorm.io/#/using-cli/installing-cli).



#### Logs

Simple logs management is provided, principaly based on [Morgan](https://github.com/expressjs/morgan) and [Winston](https://github.com/winstonjs/winston).

You can configure main parameters in dedicated [config file](https://github.com/konfer-be/ts-express-typeorm-boilerplate/blob/master/src/config/winston.config.ts).

### Compile

Runtime compilation :

```bash
$ tsc
```

Watching compilation :

```bash
$ tsc --watch
```

### Run

Enjoy with :

```bash
$ nodemon
```


## Tests

Many packages are used to provide an useful test environment: [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/) and [Supertest](https://github.com/visionmedia/supertest).

Basic tests are already writted and are located in *test* directory.

To run your tests, launch the following command :

```bash
$ npm run test --env test
```

A coverage report is automaticaly generated by [Istanbul](https://github.com/gotwarlost/istanbul) in *./docs/nyc-coverage*.

## Documentation

### API documentation

This way provides documentation for **consumers**.

```bash
$ npm run apidoc-ci
```

An API documentation website is generated into *./docs/apidoc/*.

See [apidoc](http://apidocjs.com/) for more informations about customization.

### Code documentation

This way provides documentation for **developers**.

```bash
$ npm run typedoc-ci
```

A code documentation website is generated into *./docs/typedoc/*.

See [typedoc](https://typedoc.org/) for more informations about customization.

## Continuous integration

Basic Travis-CI configuration is provided in *./.travis.yml* file.

## Deployment

Project implements a basic [PM2](https://github.com/Unitech/PM2/) configuration to allow easy deployment.

First, install PM2 globaly :

```bash
$ npm i pm2 -g
```

Note that PM2 should also be installed on other server environments, and that your SSH public key must be granted by the destination server.

#### Configuration

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

#### Deploy

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


## Dependencies

- awilix (dependency injection)
- axios (http requests)
- bcrypt (cryptography)
- body-parser (payload exposition)
- boom (errors throwing)
- compression (gzip responses)

- cors (security)
- crypto (cryptography)
- dotenv (.env files)

- es6-promisify (es6 promisification)
- express (framework)
- express-rate-limit (rate limit on api)
- express-validation (validation)
- express-validator (on the fly validation)
- helmet (security)
- hpp (security)
- http-status (easy HTTP status response)
- jimp (image manipulation)
- joi (validation rules)
- json-api-serializer (serializing)
- jwt-simple (JWT enconding / decoding)
- lodash (utils)
- module-alias (typescript paths)
- moment (date treatments)
- moment-timezone (date treatments)
- morgan (HTTP logs)
- multer (file upload)
- node-notifier (desktop notifications)
- passport (authentification)
- passport-facebook (authentification with Facebook graph)
- passport-google-auth (authentification with Google oAuth)
- passport-http-bearer (authentification with Bearer strategy)
- passport-jwt (authentification with JWT)
- passport-local (authentification with local database)
- pluralize (pluralization)
- reflect-metadata (model reflection)
- typeorm (ORM)
- uuid (unique identifier generating)
- winston (logs)
