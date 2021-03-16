// --- Test modules

var request = require('supertest');
var chance = require('chance').Chance();
var sinon = require('sinon');
var { clone } = require('lodash');
var { expect } = require('chai');

// --- API server

var { server } = require(process.cwd() + '/dist/api/app.bootstrap');
var { User } = require(process.cwd() + '/dist/api/models/user.model');

var Guard = require(process.cwd() + '/dist/api/middlewares/guard.middleware');

// --- API utils

var { encrypt } = require(process.cwd() + '/dist/api/utils/string.util');

// --- Test utils

var fixtures = require(process.cwd() + '/test/utils/fixtures');
var { doRequest, doQueryRequest, doOauth } = require(process.cwd() + '/test/utils');


describe('Authentification routes', function () {
  
  var agent, password, credentials, token, refreshToken, apikey, user;
  
  before(function (done) {

    try {

      agent       = request.agent(server);
      password    = 'e2q2mak7';
      credentials = fixtures.user.entity('admin', password);
      apikey      = encrypt(credentials.email);

      doRequest(agent, 'post', '/api/v1/auth/register', null, null, credentials, 201, function(err, res) {
        expect(res.statusCode).to.eqls(201);
        token = res.body.token.accessToken;
        doRequest(agent, 'post', '/api/v1/auth/register', null, null, fixtures.user.entity('user', password), 201, function(err, res) {
          expect(res.statusCode).to.eqls(201);
          unauthorizedToken = res.body.token.accessToken;
          user = res.body.user;
          done();
        });
      });

    } catch(e) {
      done(e);
    }
    
  });
  
  after(function () {
    server.close();
    server = undefined;
    delete server;
  });

  describe('Register', function() {

    it('POST /api/v1/auth/register 400 - empty payload', function (done) {
      doRequest(agent, 'post', '/api/v1/auth/register', null, null, {}, 400, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('POST /api/v1/auth/register 400 - bad email', function (done) {
      const payload = fixtures.user.entity('user');
      payload.email = 'imnotanemail';
      doRequest(agent, 'post', '/api/v1/auth/register', null, null, payload, 400, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('POST /api/v1/auth/register 400 - password too short', function (done) {
      const payload = fixtures.user.entity('user');
      payload.password = chance.hash({ length: 7 });
      doRequest(agent, 'post', '/api/v1/auth/register', null, null, payload, 400, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('POST /api/v1/auth/register 400 - password too long', function (done) {
      const payload = fixtures.user.entity('user');
      payload.password = chance.hash({ length: 17 });
      doRequest(agent, 'post', '/api/v1/auth/register', null, null, payload, 400, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('POST /api/v1/auth/register 409 - duplicate entry (email)', function (done) {
      doRequest(agent, 'post', '/api/v1/auth/register', null, null, credentials, 409, function(err, res) {
        expect(res.statusCode).to.eqls(409);
        done();
      });
    });

    it('POST /api/v1/auth/register 201', function (done) {
      const payload = fixtures.user.entity('admin', 'e2q2mak7');
      doRequest(agent, 'post', '/api/v1/auth/register', null, null, payload, 201, function(err, res) {
        expect(res.statusCode).to.eqls(201);
        done();
      });
    });

  });

  describe('Login', function() {

    it('POST /api/v1/auth/login 400 - empty payload', function (done) {
      doRequest(agent, 'post', '/api/v1/auth/login', null, null, {}, 400, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('POST /api/v1/auth/login 401 - bad password', function (done) {
      const payload = clone(credentials);
      payload.password = chance.hash({ length: 8 })
      doRequest(agent, 'post', '/api/v1/auth/login', null, null, payload, 401, function(err, res) {
        expect(res.statusCode).to.eqls(401);
        done();
      });
    });

    it('POST /api/v1/auth/login 401 - Bad API key', function (done) {
      doRequest(agent, 'post', '/api/v1/auth/login', null, null, { apikey: 'fake' + credentials.apikey }, 401, function(err, res) {
        expect(res.statusCode).to.eqls(404);
        done();
      });
    });

    it('POST /api/v1/auth/login 403 - invalid refresh token', function (done) {
      const payload = clone(credentials);
      delete payload.password;
      payload.refreshToken = { user: { email: payload.email }, expires: new Date() }
      doRequest(agent, 'post', '/api/v1/auth/login', null, null, payload, 401, function(err, res) {
        expect(res.statusCode).to.eqls(401);
        done();
      });
    });

    it('POST /api/v1/auth/login 404 - email not found', function (done) {
      const payload = clone(credentials);
      payload.email = 'fake' + chance.email();
      doRequest(agent, 'post', '/api/v1/auth/login', null, null, payload, 404, function(err, res) {
        expect(res.statusCode).to.eqls(404);
        done();
      });
    });

    it('POST /api/v1/auth/login 201 - with credentials + data ok', function (done) {
      doRequest(agent, 'post', '/api/v1/auth/login', null, null, { email: credentials.email, password: password }, 201, function(err, res) {
        expect(res.statusCode).to.eqls(201);
        expect(res.body).to.have.all.keys(['token', 'user']);
        expect(res.body.token).to.have.all.keys(['tokenType', 'accessToken', 'refreshToken', 'expiresIn']);
        refreshToken = res.body.token.refreshToken;
        done();
      });
    });

    it('POST /api/v1/auth/login 201 - with api key + data ok', function (done) {
      doRequest(agent, 'post', '/api/v1/auth/login', null, null, { apikey }, 201, function(err, res) {
        expect(res.statusCode).to.eqls(201);
        expect(res.body).to.have.all.keys(['token', 'user']);
        expect(res.body.token).to.have.all.keys(['tokenType', 'accessToken', 'refreshToken', 'expiresIn']);
        refreshToken = res.body.token.refreshToken;
        done();
      });
    });
    
  });

  describe('OAuth', function() {

    ['facebook', 'github', 'google', 'linkedin'].forEach(provider => {

      describe(provider, function() {

        it.skip(`GET /api/v1/auth/${provider} 302 - oauth redirection is ok`, function (done) {
          doQueryRequest(agent, `/api/v1/auth/${provider}`, null, null, {}, 302, function(err, res) {
            expect(res.statusCode).to.eqls(302);
            done();
          });
        });
  
        it(`GET /api/v1/auth/${provider}/callback 400 - code is required`, function (done) {
          doQueryRequest(agent, `/api/v1/auth/${provider}/callback`, null, null, {}, 400, function(err, res) {
            expect(res.statusCode).to.eqls(400);
            done();
          });
        });
        
        it(`GET /api/v1/auth/${provider}/callback 400 - invalid verification code format`, function (done) {
          doQueryRequest(agent, `/api/v1/auth/${provider}/callback`, null, null, { code: 'thisisacode' }, 400, function(err, res) {
            expect(res.statusCode).to.eqls(400);
            done();
          });
        });
  
        it(`GET /api/v1/auth/${provider}/callback 400 - authentication failed`, (done) => {
  
          const stub = sinon.stub(Guard.Guard, 'oAuthentify');
  
          stub.callsFake((...args) => {
            args[4](args[0], args[1], args[2])( new Error('bad'), null )
            return ({ err: null, user: { username: 'YODA' } })
          });
  
          doQueryRequest(agent, `/api/v1/auth/${provider}/callback`, null, null, { code: 'thisisacode' }, 400, function(err, res) {
            expect(res.statusCode).to.eqls(400);
            stub.restore();
            done();
          });
        });
  
        it(`GET /api/v1/auth/${provider}/callback 403 - forbidden role`, (done) => {
  
          const stub = sinon.stub(Guard.Guard, 'oAuthentify');
  
          stub.callsFake((...args) => {
            args[4](args[0], args[1], args[2])( null, { username: 'YODA', role: 'supersayen' } )
            return ({ err: null, user: { username: 'YODA' } })
          });
  
          doQueryRequest(agent, `/api/v1/auth/${provider}/callback`, null, null, { code: 'thisisacode' }, 403, function(err, res) {
            expect(res.statusCode).to.eqls(403);
            stub.restore();
            done();
          });
        });
  
        it(`GET /api/v1/auth/${provider}/callback 404 - user not found at provider`, (done) => {
  
          const stub = sinon.stub(Guard.Guard, 'oAuthentify');
  
          stub.callsFake((...args) => {
            args[4](args[0], args[1], args[2])( null, null )
            return ({ err: null, user: { username: 'YODA' } })
          });
  
          doQueryRequest(agent, `/api/v1/auth/${provider}/callback`, null, null, { code: 'thisisacode' }, 404, function(err, res) {
            expect(res.statusCode).to.eqls(404);
            stub.restore();
            done();
          });
        });
  
        it(`GET /api/v1/auth/${provider}/callback 200 - credentials received`, (done) => {
  
          const stub = sinon.stub(Guard.Guard, 'oAuthentify');
  
          stub.callsFake((...args) => {
            args[4](args[0], args[1], args[2])( null, new User(user))
            return ({ err: null, user: { username: 'YODA' } })
          });
  
          doQueryRequest(agent, `/api/v1/auth/${provider}/callback`, null, null, { code: 'thisisacode' }, 200, function(err, res) {
            expect(res.statusCode).to.eqls(200);
            expect(res.body).to.haveOwnProperty('token');
            expect(res.body.token).to.haveOwnProperty('tokenType');
            expect(res.body.token.tokenType).to.be.eqls('Bearer');
            expect(res.body).to.haveOwnProperty('user');
            stub.restore()
            done();
          });
        });
  
      });

    });

  });

  describe('Refresh token', function() {

    it('POST /api/v1/auth/refresh-token 400 - empty payload', function (done) {
      doRequest(agent, 'post', '/api/v1/auth/refresh-token', null, null, {}, 400, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('POST /api/v1/auth/refresh-token 400 - refresh token length not valid', function (done) {
      doRequest(agent, 'post', '/api/v1/auth/refresh-token', null, null, { token: { refreshToken: refreshToken.substr(0,80) } }, 400, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('POST /api/v1/auth/refresh-token 404 - refresh token not found', function (done) {
      doRequest(agent, 'post', '/api/v1/auth/refresh-token', null, null, { token: { refreshToken: '0' + refreshToken.substring(1, refreshToken.length -1) + '0' } }, 404, function(err, res) {
        expect(res.statusCode).to.eqls(404);
        done();
      });
    });

    it('POST api/v1/auth/refresh-token 201 - data ok', function (done) {
      doRequest(agent, 'post', '/api/v1/auth/refresh-token', null, token, { token: { refreshToken: refreshToken } }, 201, function(err, res) {
        expect(res.statusCode).to.eqls(201);
        expect(res.body).to.have.all.keys(['token']);
        expect(res.body.token).to.have.all.keys(['tokenType', 'accessToken', 'refreshToken', 'expiresIn']);
        done();
      });
    });
    
  });

});