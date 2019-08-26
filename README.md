# Typescript / Express.js / Typeorm RESTful API boilerplate

[![Build Status](https://travis-ci.com/konfer-be/ts-express-typeorm-boilerplate.svg?token=DmbPFqq91BhwsJKVDsHw&branch=master)](https://travis-ci.com/konfer-be/ts-express-typeorm-boilerplate)
[![Coverage](https://img.shields.io/badge/Coverage-88.35%25-green)](https://github.com/ellerbrock/typescript-badges/)
[![Node](https://img.shields.io/badge/Node-10.9-green)](https://nodejs.org/docs/latest-v10.x/api/index.html)
[![Express](https://img.shields.io/badge/Express-4.16-lightgrey)](https://expressjs.com/fr/)
[![TypeScript](https://img.shields.io/badge/Typescript-5.3-blue)](https://www.typescriptlang.org/)
[![Typeorm](https://img.shields.io/badge/Typeorm-0.2-orange)](https://typeorm.io/#/)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

This repository contain small but badass, scalable RESTful API boilerplate [Express.js](http://expressjs.com/en/4x/api.html), [Typescript](https://github.com/Microsoft/TypeScript) and [TypeORM](https://github.com/typeorm/typeorm) based.

Thanks a lot to [Daniel F. Sousa](https://github.com/danielfsousa) for the inspiration with her [Express REST 2017 boilerplate](https://github.com/danielfsousa/express-rest-es2017-boilerplate).

## Summary

* [Start](#start)
* [Environment features](#environment-features)
  * [Typescript](#typescript)
  * [Object Relational Mapping](#orm)
  * [Entity generating](#entity-generating)
  * [Tests](#tests)
  * [Deployment](#deployment)
  * [Documentation](#documentation)
  * [Dependencies](#dependencies)

## Start

### Install

Clone the boilerplate :

```bash
$ git clone https://github.com/konfer-be/rest-api-ts-express-typeorm.git your-project-name/
```

### Build

Give the kickstart :

```bash
$ npm run kickstart
```

This will be install Typescript and Typeorm globaly, install NPM packages, create *dist* directory and sub-directories, and run a one shot compilation.

### Configure

Adapt yours .env files (dev, test, staging, production) with your own configuration for mandatory properties:

```env
# TypeORM
TYPEORM_HOST = "localhost"
TYPEORM_DB = "your-database-name"
TYPEORM_USER = "root"
TYPEORM_PWD = "root"
TYPEORM_PORT = "3306"
```

Enjoy with :

```bash
$ nodemon
```

## Environment features

### Typescript

The latest version of [Typescript](https://www.typescriptlang.org/) is used by default.

#### Configuration

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

#### Compilation

Run time compilation :

```bash
$ tsc
```

Watching compilation :

```bash
$ tsc --watch
```

### ORM

ORM couch is provided by [Typeorm](https://github.com/typeorm/typeorm).

#### Configuration

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

#### Migration

A Typeorm migration is a DB synchronizing. If your schema have pending changes, migration tool allow you to synchronize it.

```bash
$ npm run typeorm migration:generate -n NameOfYoursPendingChanges
$ npm run typeorm migration:run
```

**Although this case is anticipated/prevented in the boilerplate, be extremely careful with the synchronize parameter. When is true, Typeorm will automaticaly execute pending changes on your database, and some data may be lost. Set synchronize at true only in development|staging|test environments.**

More info about [typeorm migration](http://typeorm.io/#/migrations).

#### Events subscribers

Typeorm provides events listening on your models. So, you can define your owns listeners/subscribers, and use it to do actions when a specific event is fired.

More info about [typeorm subscribers](https://typeorm.io/#/listeners-and-subscribers).

### Entity generating

The boilerplate expose a basic entity generator, which be used as NPM task. This generate following files :

* Model
* Controller 
* Repository
* Validation 
* Route
* Test
* Serializer

So, the proxy router service is updated with the dedicated entity router which has just been created.

To use the file generating, run the following command :

```bash
$ npm run generate YOUR_ENTITY_NAME
```

Note that the generated files contains only basic features. Note also that some parts must be filled by yourself :

* **Validation rules**: body rules are created but empty by default. Fill it with your rules.
* **Model**: model is filled with a primary auto-incremented id, and date system columns. Fill it with your columns and relations.
* **Serializer**: attributes as empty by default.Fill it with your entity attributes.

### Tests

Many packages are used to provide an useful test environment: [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/) and [Supertest]();

Basic tests are already writted and are located in *test* directory.

To run your tests, launch the following command :

```bash
$ npm run test --env test
```

#### Travis

A *./travis.yml* file is provided with a basic configuration. 

#### Code coverage 

When you launch your tests, a coverage report is automaticaly generated by [Istanbul](https://github.com/gotwarlost/istanbul) in *./docs/nyc-coverage*.

You can also launch a [plato](https://github.com/es-analysis/plato) code coverage inspection : 

```bash
$ npm run coverage
```

A coverage report is generated in *./docs/plato-coverage*.

Unfortunately, Plato is not longer maintened and some functionalities are broken with ES6. See [es6-plato](https://www.npmjs.com/package/es6-plato) if you wish implements this feature.

### Deployment

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

### Documentation

Here are two ways to generate your documentation : api and code.

#### API documentation

This way provide a documentation for **consumers**.

```bash
$ npm run apidoc-ci
```

An API documentation website is generated into *./docs/apidoc/*.

See [apidoc](http://apidocjs.com/) for more informations about customization.

#### Code documentation

This way provide a documentation for **developers**.

```bash
$ npm run typedoc-ci
```

A code documentation website is generated into *./docs/typedoc/*.

See [typedoc](https://typedoc.org/) for more informations about customization.



### Dependencies

- awilix (dependency injection)
- axios (http requests)
- bcrypt (cryptography)
- body-parser (payload exposition)
- boom (errors throwing)
- compression (gzip responses)
- cookie-parser (cookie exposition)
- cors (security)
- crypto (cryptography)
- dotenv (.env files)
- errorhandler (errors handling)
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
