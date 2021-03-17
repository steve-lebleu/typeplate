// --- Test modules

const request = require('supertest');
const chance = require('chance').Chance();
const sinon = require('sinon');
const { clone } = require('lodash');
const { expect } = require('chai');

// --- API server

let { server } = require(process.cwd() + '/dist/api/app.bootstrap');
const { User } = require(process.cwd() + '/dist/api/models/user.model');

const Guard = require(process.cwd() + '/dist/api/middlewares/guard.middleware');

// --- API utils

const { encrypt } = require(process.cwd() + '/dist/api/utils/string.util');

// --- Test utils

const fixtures = require(process.cwd() + '/test/utils/fixtures');
const { doRequest, doQueryRequest } = require(process.cwd() + '/test/utils');

describe('Authentification routes', function () {
  
  let agent, password, credentials, token, refreshToken, apikey, user;
  
  before(function (done) {

    try {

      agent       = request.agent(server);
      password    = 'e2q2mak7';
      credentials = fixtures.user.entity('admin', password);
      apikey      = encrypt(credentials.email);

      doRequest(agent, 'post', '/api/v1/auth/register', null, null, credentials, function(err, res) {
        expect(res.statusCode).to.eqls(201);
        token = res.body.token.accessToken;
        doRequest(agent, 'post', '/api/v1/auth/register', null, null, fixtures.user.entity('user', password), function(err, res) {
          expect(res.statusCode).to.eqls(201);
          unauthorizedToken = res.body.token.accessToken;
          user = res.body.user;
          done();
        });
      });

    } catch(e) { done(e); }
    
  });
  
  after(function () {
    server.close();
    delete server;
  });

  describe('POST /api/v1/auth/register', () => {

    const route = '/api/v1/auth/register';

    it('400 - empty payload', function (done) {
      doRequest(agent, 'post', route, null, null, {}, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('400 - bad email', function (done) {
      const payload = fixtures.user.entity('user');
      payload.email = 'imnotanemail';
      doRequest(agent, 'post', route, null, null, payload, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('400 - password too short', function (done) {
      const payload = fixtures.user.entity('user');
      payload.password = chance.hash({ length: 7 });
      doRequest(agent, 'post', route, null, null, payload, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('400 - password too long', function (done) {
      const payload = fixtures.user.entity('user');
      payload.password = chance.hash({ length: 17 });
      doRequest(agent, 'post', route, null, null, payload, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('409 - duplicate entry (email)', function (done) {
      doRequest(agent, 'post', route, null, null, credentials, function(err, res) {
        expect(res.statusCode).to.eqls(409);
        done();
      });
    });

    it('201', function (done) {
      const payload = fixtures.user.entity('admin', 'e2q2mak7');
      doRequest(agent, 'post', route, null, null, payload, function(err, res) {
        expect(res.statusCode).to.eqls(201);
        expect(res.body).to.haveOwnProperty('token')
        expect(res.body).to.haveOwnProperty('user')
        expect(res.body.user).to.not.haveOwnProperty('password');
        expect(res.body.user).to.not.haveOwnProperty('apikey');
        done();
      });
    });

  });

  describe('POST /api/v1/auth/login', function() {

    const route = '/api/v1/auth/login'

    it('400 - empty payload', function (done) {
      doRequest(agent, 'post', route, null, null, {}, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('401 - bad password', function (done) {
      const payload = clone(credentials);
      payload.password = chance.hash({ length: 8 })
      doRequest(agent, 'post', route, null, null, payload, function(err, res) {
        expect(res.statusCode).to.eqls(401);
        done();
      });
    });

    it('401 - Bad API key', function (done) {
      doRequest(agent, 'post', route, null, null, { apikey: 'fake' + credentials.apikey }, function(err, res) {
        expect(res.statusCode).to.eqls(404);
        done();
      });
    });

    it('403 - invalid refresh token', function (done) {
      const payload = clone(credentials);
      delete payload.password;
      payload.refreshToken = { user: { email: payload.email }, expires: new Date() }
      doRequest(agent, 'post', route, null, null, payload, function(err, res) {
        expect(res.statusCode).to.eqls(401);
        done();
      });
    });

    it('404 - email not found', function (done) {
      const payload = clone(credentials);
      payload.email = 'fake' + chance.email();
      doRequest(agent, 'post', route, null, null, payload, function(err, res) {
        expect(res.statusCode).to.eqls(404);
        done();
      });
    });

    it('201 - with credentials + data ok', function (done) {
      doRequest(agent, 'post', route, null, null, { email: credentials.email, password: password }, function(err, res) {
        expect(res.statusCode).to.eqls(201);
        expect(res.body).to.have.all.keys(['token', 'user']);
        expect(res.body.token).to.have.all.keys(['tokenType', 'accessToken', 'refreshToken', 'expiresIn']);
        expect(res.body.user).to.not.haveOwnProperty('password');
        expect(res.body.user).to.not.haveOwnProperty('apikey');
        refreshToken = res.body.token.refreshToken;
        done();
      });
    });

    it('201 - with api key + data ok', function (done) {
      doRequest(agent, 'post', route, null, null, { apikey }, function(err, res) {
        expect(res.statusCode).to.eqls(201);
        expect(res.body).to.have.all.keys(['token', 'user']);
        expect(res.body.token).to.have.all.keys(['tokenType', 'accessToken', 'refreshToken', 'expiresIn']);
        expect(res.body.user).to.not.haveOwnProperty('password');
        expect(res.body.user).to.not.haveOwnProperty('apikey');
        refreshToken = res.body.token.refreshToken;
        done();
      });
    });
    
  });

  ['facebook', 'github', 'google', 'linkedin'].forEach(provider => {

    describe(`GET /api/v1/auth/${provider}`, function() {

      it.skip(`302 - oauth redirection is ok`, function (done) {
        doQueryRequest(agent, `/api/v1/auth/${provider}`, null, null, {}, function(err, res) {
          expect(res.statusCode).to.eqls(302);
          done();
        });
      });
    
    });

    describe(`GET /api/v1/auth/${provider}/callback`, function() {

      it(`400 - code is required`, function (done) {
        doQueryRequest(agent, `/api/v1/auth/${provider}/callback`, null, null, {}, function(err, res) {
          expect(res.statusCode).to.eqls(400);
          done();
        });
      });
      
      it(`400 - invalid verification code format`, function (done) {
        doQueryRequest(agent, `/api/v1/auth/${provider}/callback`, null, null, { code: 'thisisacode' }, function(err, res) {
          expect(res.statusCode).to.eqls(400);
          done();
        });
      });

      it(`400 - authentication failed`, (done) => {
        const stub = sinon.stub(Guard.Guard, 'oAuthentify');
        stub.callsFake((...args) => {
          args[4](args[0], args[1], args[2])( new Error('bad'), null )
          return ({ err: null, user: { username: 'YODA' } })
        });
        doQueryRequest(agent, `/api/v1/auth/${provider}/callback`, null, null, { code: 'thisisacode' }, function(err, res) {
          expect(res.statusCode).to.eqls(400);
          stub.restore();
          done();
        });
      });

      it(`403 - forbidden role`, (done) => {
        const stub = sinon.stub(Guard.Guard, 'oAuthentify');
        stub.callsFake((...args) => {
          args[4](args[0], args[1], args[2])( null, { username: 'YODA', role: 'supersayen' } )
          return ({ err: null, user: { username: 'YODA' } })
        });
        doQueryRequest(agent, `/api/v1/auth/${provider}/callback`, null, null, { code: 'thisisacode' }, function(err, res) {
          expect(res.statusCode).to.eqls(403);
          stub.restore();
          done();
        });
      });

      it(`404 - user not found at provider`, (done) => {
        const stub = sinon.stub(Guard.Guard, 'oAuthentify');
        stub.callsFake((...args) => {
          args[4](args[0], args[1], args[2])( null, null )
          return ({ err: null, user: { username: 'YODA' } })
        });
        doQueryRequest(agent, `/api/v1/auth/${provider}/callback`, null, null, { code: 'thisisacode' }, function(err, res) {
          expect(res.statusCode).to.eqls(404);
          stub.restore();
          done();
        });
      });

      it(`200 - credentials received`, (done) => {
        const stub = sinon.stub(Guard.Guard, 'oAuthentify');
        stub.callsFake((...args) => {
          args[4](args[0], args[1], args[2])( null, new User(user))
          return ({ err: null, user: { username: 'YODA' } })
        });
        doQueryRequest(agent, `/api/v1/auth/${provider}/callback`, null, null, { code: 'thisisacode' }, function(err, res) {
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

  describe('POST /api/v1/auth/refresh-token', () => {

    const route = '/api/v1/auth/refresh-token';

    it('400 - empty payload', function (done) {
      doRequest(agent, 'post', route, null, null, {}, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('400 - refresh token length not valid', function (done) {
      doRequest(agent, 'post', route, null, null, { token: { refreshToken: refreshToken.substr(0,80) } }, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('404 - refresh token not found', function (done) {
      doRequest(agent, 'post', route, null, null, { token: { refreshToken: '0' + refreshToken.substring(1, refreshToken.length -1) + '0' } }, function(err, res) {
        expect(res.statusCode).to.eqls(404);
        done();
      });
    });

    it('201 - data ok', function (done) {
      doRequest(agent, 'post', route, null, token, { token: { refreshToken: refreshToken } }, function(err, res) {
        expect(res.statusCode).to.eqls(201);
        expect(res.body).to.have.all.keys(['token']);
        expect(res.body.token).to.have.all.keys(['tokenType', 'accessToken', 'refreshToken', 'expiresIn']);
        done();
      });
    });

  });

});