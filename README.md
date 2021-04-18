![Typescript / Express / Typeorm REST API boilerplate](https://i.ibb.co/tbqXm9Q/header-ts-boilerplate-4.png)

[![Node](https://img.shields.io/badge/Node-14.16.0-informational?logo=node.js&color=43853D)](https://nodejs.org/docs/latest-v14.x/api/index.html)
[![TypeScript](https://img.shields.io/badge/Typescript-4.2.2-informational?logo=typescript&color=2F74C0)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.16.4-informational?logo=express&color=B1B1B1)](https://expressjs.com/)
[![Typeorm](https://img.shields.io/badge/Typeorm-0.2.31-informational?logo=typeorm&color=E8352B)](https://typeorm.io/#/)
[![Mocha](https://img.shields.io/badge/Mocha-8.0.3-informational?logo=mocha&color=8A6343)](https://mochajs.org)

[![Build Status](https://travis-ci.com/konfer-be/ts-express-typeorm.svg?token=DmbPFqq91BhwsJKVDsHw&branch=master)](https://travis-ci.com/konfer-be/ts-express-typeorm)
[![Coverage Status](https://coveralls.io/repos/github/konfer-be/ts-express-typeorm/badge.svg?branch=master)](https://coveralls.io/github/konfer-be/ts-express-typeorm?branch=master)
![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/konfer-be/ts-express-typeorm/master)
![Requires.io (branch)](https://img.shields.io/requires/github/konfer-be/ts-express-typeorm/master)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/konfer-be/ts-express-typeorm)

[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

Ready to use RESTful API boilerplate builded with [Express.js](http://expressjs.com/en/4x/api.html), [Typescript](https://github.com/Microsoft/TypeScript)  [TypeORM](https://github.com/typeorm/typeorm) and [Mocha](https://mochajs.org/). 🤘

Thanks to Daniel F. Sousa for inspiration with her [Express ES2017 REST API boilerplate](https://github.com/danielfsousa/express-rest-boilerplate) :beer: :beer: :beer:
## > Features

* **Clear code architecture** with classic layers such controllers, services, repositories, models, ...
* **Object Relational Mapping** with [Typeorm](https://typeorm.io/#/).
* **SSL secure connection** with native [HTTPS node module](https://nodejs.org/docs/latest-v14.x/api/https.html).
* **Entity generation** (controller, route, repository, model, validations, test, fixture) with [rsgen](https://github.com/konfer-be/rsgen).
* **Sending transactional emails** with [cliam](https://github.com/konfer-be/cliam).
* **Cross Origin Resource Sharing** with [CORS](https://expressjs.com/en/resources/middleware/cors.html).
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
* [Entity generation](#entity-generation)
* [Documentation](#documentation)
* [Tests](#tests)
* [Continuous integration](#continuous-integration)
* [Deployment](#deployment)
* [Related links](#related-links)
* [Licence](#licence)

## > Getting started

### Prerequisites

* Git
* Node.js >= 14.16.0
* NPM >= 6.14.0 or yarn
* A database engine

When you're ready with that, starting your project is a matter of minutes. :clock12:

### Step 1: install

```bash
$ git clone https://github.com/konfer-be/ts-express-typeorm.git path-to/your-project-name/
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
$ rm -rf ./.git && npm run build:repo
```

### Step 5: setup package.json

Open the *./package.json* file and edit *version*, *author*, *name*, *description*, *homepage*, *repository* and *bugs* fields with your own values.

### Step 6: setup environment variables

Environment variables are defined in *.env* files. Open *./dist/env/development.env* and fill the required values (uncommented in the file). See [env variables list](https://github.com/konfer-be/ts-express-typeorm/wiki/Environment-variables) for more informations.

```bash
# Access token Secret passphrase
ACCESS_TOKEN_SECRET = "your-secret"

# CORS authorized domains
AUTHORIZED = "http://localhost:4200"

# API domain
DOMAIN = "localhost"

# Application port.
PORT = 8101

# Database engine
TYPEORM_TYPE = "mysql"

# Database server host
TYPEORM_HOST = "localhost"

# Database name. Keep it different from your developement database.
TYPEORM_DB = "your-database"

# Database user
TYPEORM_USER = "root"

# Database password
TYPEORM_PWD = ""

# Database port
TYPEORM_PORT = "3306"
```

### Step 7: setup cliamrc.json for sending transactional email

Sending transactional email is provided by [cliam](https://github.com/konfer-be/cliam).  Currently supported providers are Mailgun, Mailjet, Postmark, Sendgrid, Sendinblue and Sparkpost. If you're not with they, you can use a simple SMTP server.

Open the *.cliamrc.json* and fill the [required configuration](https://github.com/konfer-be/cliam/wiki/Configuration) according your sending mode. 

See [Cliam official documentation](https://github.com/konfer-be/cliam/wiki) for more information about configuration of this file.

Note that sandbox is set to true by default and emails are not send. Pass this value to false when you're ready.

### Step 8: compile

```bash
$ tsc
```

### Step 9: run & enjoy

```bash
$ nodemon
```

## > Entity generation

Some repetitive tasks such as creating resources can be done easily with [rsgen](https://github.com/konfer-be/rsgen). This small tool allow you to generate a complete set of resources who are linked to an entity:

- Controller
- Routes
- Repository
- Model
- Validations
- E2e tests
- Fixtures

See the [documentation](https://github.com/konfer-be/ts-express-typeorm/wiki/Entity-generation) about it.

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

## > Related links

- More info about [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- More info about [ormconfig file](http://typeorm.io/#/using-ormconfig) and [typeorm cli](https://typeorm.io/#/using-cli/installing-cli)

## > License

[MIT](/LICENSE)