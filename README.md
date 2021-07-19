![Typescript / Express / Typeorm REST API boilerplate](https://i.ibb.co/tbqXm9Q/header-ts-boilerplate-4.png)

[![Node](https://img.shields.io/badge/Node-14.16.0-informational?logo=node.js&color=43853D)](https://nodejs.org/docs/latest-v14.x/api/index.html)
[![TypeScript](https://img.shields.io/badge/Typescript-4.2.3-informational?logo=typescript&color=2F74C0)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.16.4-informational?logo=express&color=B1B1B1)](https://expressjs.com/)
[![Typeorm](https://img.shields.io/badge/Typeorm-0.2.33-informational?logo=typeorm&color=FFAB00)](https://typeorm.io/#/)
[![Mocha](https://img.shields.io/badge/Mocha-8.0.3-informational?logo=mocha&color=8A6343)](https://mochajs.org)

[![Build](https://github.com/konfer-be/typeplate/actions/workflows/release.yml/badge.svg)](https://github.com/konfer-be/typeplate/actions/workflows/release.yml)
[![Coverage Status](https://coveralls.io/repos/github/konfer-be/typeplate/badge.svg?branch=master)](https://coveralls.io/github/konfer-be/typeplate?branch=master)
![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/konfer-be/typeplate/master)
![Requires.io (branch)](https://img.shields.io/requires/github/konfer-be/typeplate/master)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/konfer-be/typeplate)

[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

Ready to use RESTful API boilerplate builded with [Express.js](http://expressjs.com/en/4x/api.html), [Typescript](https://github.com/Microsoft/TypeScript)  [TypeORM](https://github.com/typeorm/typeorm) and [Mocha](https://mochajs.org/). 🤘

Thanks to Daniel F. Sousa for inspiration with her [Express ES2017 REST API boilerplate](https://github.com/danielfsousa/express-rest-boilerplate) :beer: :beer: :beer:
## > Features

- **Basics**
  - **Clear & clean code architecture** with classic layers such controllers, services, repositories, models, ...
  - **Object Relational Mapping** with [typeorm](https://typeorm.io/#/).
  - **Entity generation** with [rsgen](https://github.com/konfer-be/rsgen).
  - **Business validation** with self designed business members.
  - **Logs management** with [morgan](https://github.com/expressjs/morgan) and [winston](https://github.com/winstonjs/winston).
  - **Changelog completion** with [auto-changelog](https://www.npmjs.com/package/auto-changelog).
  - **Testing** with included unit and e2e test sets builded with [mocha](https://mochajs.org/), [chai](https://www.chaijs.com/), [sinon](https://sinonjs.org/) and [supertest](https://github.com/visionmedia/supertest).
  - **Documentation** with [api-doc](https://apidocjs.com/).
- **Security**
  - **SSL secure connection** with native [HTTPS node module](https://nodejs.org/docs/latest-v14.x/api/https.html).
  - **Cross Origin Resource Sharing** with [CORS](https://expressjs.com/en/resources/middleware/cors.html).
  - **Securized HTTP headers** with [helmet](https://helmetjs.github.io/).
  - **HTTP header pollution** preventing with [hpp](https://www.npmjs.com/package/hpp).
  - **API request rate limit** with [express-rate-limit](https://www.npmjs.com/package/express-rate-limit).
  - **Route validation** with [joi](https://github.com/hapijs/joi).
  - **HTTP friendly errors** with [boom](https://github.com/hapijs/boom) and [http-status](https://www.npmjs.com/package/http-status).
- **Authentication**
  - **JWT authentication process** with [passport.js](http://www.passportjs.org/).
  - **oAuth authentication process** with [passport.js](http://www.passportjs.org/). 
  - **Sending transactional emails** with [cliam](https://github.com/konfer-be/cliam).
- **Performances**
  - **HTTP request cache** with [memory-cache](https://www.npmjs.com/package/memory-cache).
  - **Database query cache** with [typeorm caching](https://github.com/typeorm/typeorm/blob/master/docs/caching.md).
- **Assets management**
  - **Customizable file upload** with [multer](https://www.npmjs.com/package/multer).
  - **Customizable image resizing** with [jimp](https://www.npmjs.com/package/jimp).

## > Table of contents

* [Getting started](#getting-started)
* [Entity generation](#entity-generation)
* [Documentation](#documentation)
* [Tests](#tests)
* [Continuous integration](#continuous-integration)
* [Deployment](#deployment)
* [Licence](#licence)

## > Getting started

### Prerequisites

* Git
* Node.js >= 14.16.0
* NPM >= 6.14.0
* A database engine with a dedicated database

When you're with that, starting your project is a matter of minutes. :clock12:

### Step 1: install

```bash
$ git clone https://github.com/konfer-be/typeplate.git path-to/your-project-name/
```

### Step 2: go to

```bash
$ cd path-to/your-project-name/
```

### Step 3: build

```bash
$ npm run kickstart:dev
```

### Step 4: setup package.json

Open the *./package.json* file and edit it with your own values.

### Step 5: setup environment

Open *./dist/env/development.env* and fill the required env variables (uncommented in the file). See [env variables list](https://github.com/konfer-be/typeplate/wiki/Environment-variables) for more informations.

```bash
# Access token Secret passphrase
ACCESS_TOKEN_SECRET = "your-secret"

# CORS authorized domains
AUTHORIZED = "http://localhost:4200"

# API domain
DOMAIN = "localhost"

# Application port.
PORT = 8101

# Refresh token Secret passphrase
REFRESH_TOKEN_SECRET = "your-secret"

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

### Step 6: setup cliamrc.json

Transactional emails are send with [cliam](https://github.com/konfer-be/cliam) behind the scene. Open the *.cliamrc.json* and fill the [required configuration](https://github.com/konfer-be/cliam/wiki/Configuration) according your sending mode. See Cliam official [documentation](https://github.com/konfer-be/cliam/wiki) for more information.

Sandbox is set to true by default and emails are not send. Pass this value to false when you're ready.

### Step 7: run

```bash
$ nodemon
```

## > Entity generation

Some repetitive tasks such as creating resources can be done easily with [rsgen](https://github.com/konfer-be/rsgen).

See [entity generation](https://github.com/konfer-be/typeplate/wiki/Entity-generation) wiki section to learn more about generated elements and how to use.

## > Documentation

```bash
$ npm run doc
```

Generate API documentation website into *./docs/apidoc/*.

See [apidoc](http://apidocjs.com/) for more informations about customization.

## > Tests

```bash
$ npm run test --env test
```

HTML coverage report is generated by [Istanbul](https://github.com/gotwarlost/istanbul) in *./reports/nyc-coverage*.

Bonus with *./insomnia.workspace.json* if you wish run manual e2e tests without create the config.

## > Continuous integration

Basic Travis-CI configuration is provided in *./.travis.yml* file.

## > Deployment

Project implements a basic [PM2](https://github.com/Unitech/PM2/) configuration to allow deployment.

Install PM2 globaly :

```bash
$ npm i pm2 -g
```

### Configuration

Configure the *./ecosystem.config.js* file with your env informations.

```javascript
{
  deploy : {
    staging : {
        user : 'node',
        host : '212.83.163.1',
        ref  : 'origin/master',
        repo : 'git@github.com:repo.git',
        ssh_options: ['StrictHostKeyChecking=no', 'PasswordAuthentication=yes', 'ForwardAgent=yes'],
        path : '/var/www/staging',
          'post-setup' : 'npm run kickstart:staging && pm2 reload ecosystem.config.js --env staging',
          'post-deploy' : 'npm i && tsc && pm2 reload ecosystem.config.js --env staging'
      }
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
```

More info about [PM2](http://pm2.keymetrics.io/docs/usage/quick-start/) and [PM2 deploy](https://pm2.io/doc/en/runtime/guide/easy-deploy-with-ssh/).

## > License

[MIT](/LICENSE)