// --- Test modules

var request = require('supertest');
var chance = require('chance').Chance();

var { clone } = require('lodash');
var { expect } = require('chai');

// --- API server

var { server } = require(process.cwd() + '/dist/api/app.bootstrap');

// --- API utils

var { crypt } = require(process.cwd() + '/dist/api/utils/string.util');

// --- Test utils

var fixtures = require(process.cwd() + '/test/utils/fixtures');
var { doRequest } = require(process.cwd() + '/test/utils');


describe('Authentification routes', function () {
  
  var agent, password, credentials, token, refreshToken, apikey;
  
  before(function (done) {

    try {

      agent       = request.agent(server);
      password    = 'e2q2mak7';
      credentials = fixtures.user.entity('admin', password);
      apikey      = crypt(credentials.email + process.env.JWT_SECRET, 64);

      doRequest(agent, 'post', '/api/v1/auth/register', null, null, credentials, 201, function(err, res) {
        expect(res.statusCode).to.eqls(201);
        token = res.body.token.accessToken;
        doRequest(agent, 'post', '/api/v1/auth/register', null, null, fixtures.user.entity('user', password), 201, function(err, res) {
          expect(res.statusCode).to.eqls(201);
          unauthorizedToken = res.body.token.accessToken;
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

    describe('Facebook', function() {

      it('GET /api/v1/auth/facebook 302 - oauth redirection is ok', function (done) {
        doRequest(agent, 'get', '/api/v1/auth/facebook', null, null, {}, 302, function(err, res) {
          expect(res.statusCode).to.eqls(302);
          done();
        });
      });

    });
    
    describe('Google', function() {

      it.skip('GET /api/v1/auth/google 302 - oauth redirection is ok', function (done) {
        doRequest(agent, 'get', '/api/v1/auth/google', null, null, {}, 302, function(err, res) {
          expect(res.statusCode).to.eqls(302);
          done();
        });
      });

    });

    describe('Twitter', function() {

      it.skip('GET /api/v1/auth/twitter 302 - oauth redirection is ok', function (done) {
        doRequest(agent, 'get', '/api/v1/auth/twitter', null, null, {}, 302, function(err, res) {
          expect(res.statusCode).to.eqls(302);
          done();
        });
      });

    });

    describe('Linkedin', function() {

      it.skip('GET /api/v1/auth/linkedin 302 - oauth redirection is ok', function (done) {
        doRequest(agent, 'get', '/api/v1/auth/linkedin', null, null, {}, 302, function(err, res) {
          expect(res.statusCode).to.eqls(302);
          done();
        });
      });

    });

    describe('Github', function() {

      it.skip('GET /api/v1/auth/github 302 - oauth redirection is ok', function (done) {
        doRequest(agent, 'get', '/api/v1/auth/github', null, null, {}, 302, function(err, res) {
          expect(res.statusCode).to.eqls(302);
          done();
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