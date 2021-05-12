// --- Test modules

const request = require('supertest');
const chance = require('chance').Chance();
const sinon = require('sinon');

const { clone } = require('lodash');
const { expect } = require('chai');

// --- API server

let { server } = require(process.cwd() + '/dist/api/app.bootstrap');

// --- API utils

const Guard = require(process.cwd() + '/dist/api/core/middlewares/guard.middleware');

const { User } = require(process.cwd() + '/dist/api/core/models/user.model');
const { encrypt } = require(process.cwd() + '/dist/api/core/utils/string.util');

// --- Test utils

const { user } = require(process.cwd() + '/test/utils/fixtures');
const { doRequest, doQueryRequest } = require(process.cwd() + '/test/utils');

describe('Authentification routes', function () {
  
  let agent, _token, _loggedAccessToken, _loggedRefreshToken, _refreshToken, _user, _apikey;
  
  before(function (done) {

    agent = request.agent(server);

    // Creates first user as admin
    doRequest(agent, 'post', '/api/v1/auth/register', null, null, user.register('passw0rd', 'admin@typeplatexample.com'), function(err, res) {
      doRequest(agent, 'post', '/api/v1/auth/register', null, null, user.register('passw0rd'), function(err, res) {
        _user = res.body.user;
        _apikey = encrypt(_user.email);
        doRequest(agent, 'post', '/api/v1/auth/register', null, null, user.register('passw0rd'), function(err, res) {
          _loggedAccessToken = res.body.token.accessToken;
          _loggedRefreshToken = res.body.token.refreshToken;
          done();
        })
      });
    });
    
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
      const payload = clone(user.register('passw0rd'));
      payload.email = 'imnotanemail';
      doRequest(agent, 'post', route, null, null, payload, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('400 - password too short', function (done) {
      const payload = clone(user.register('passw0rd'));
      payload.password = chance.hash({ length: 7 });
      doRequest(agent, 'post', route, null, null, payload, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('400 - password too long', function (done) {
      const payload = clone(user.register('passw0rd'));
      payload.password = chance.hash({ length: 17 });
      doRequest(agent, 'post', route, null, null, payload, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('409 - duplicate entry (email)', function (done) {
      const payload = clone(user.register('passw0rd'));
      payload.email = _user.email;
      doRequest(agent, 'post', route, null, null, payload, function(err, res) {
        expect(res.statusCode).to.eqls(409);
        done();
      });
    });

    it('201', function (done) {
      const payload = clone(user.register('passw0rd'));
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

    it('400 - invalid refresh token', function (done) {
      const payload = { email: _user.email };
      payload.refreshToken = { user: { email: payload.email }, expires: new Date() }
      doRequest(agent, 'post', route, null, null, payload, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('401 - bad password', function (done) {
      const payload = { email: _user.email, password: 'badpassword' };
      doRequest(agent, 'post', route, null, null, payload, function(err, res) {
        expect(res.statusCode).to.eqls(401);
        done();
      });
    });

    it('401 - Bad API key', function (done) {
      doRequest(agent, 'post', route, null, null, { apikey: 'fake' + _apikey }, function(err, res) {
        expect(res.statusCode).to.eqls(404);
        done();
      });
    });

    it('404 - email not found', function (done) {
      const payload = { email: 'fake' + chance.email(), password: 'passw0rd' };
      doRequest(agent, 'post', route, null, null, payload, function(err, res) {
        expect(res.statusCode).to.eqls(404);
        done();
      });
    });

    it('201 - with credentials + data ok', function (done) {
      doRequest(agent, 'post', route, null, null, { email: _user.email, password: 'passw0rd' }, function(err, res) {
        expect(res.statusCode).to.eqls(201);
        expect(res.body).to.have.all.keys(['token', 'user']);
        expect(res.body.token).to.have.all.keys(['tokenType', 'accessToken', 'refreshToken', 'expiresIn']);
        expect(res.body.user).to.not.haveOwnProperty('password');
        expect(res.body.user).to.not.haveOwnProperty('apikey');
        done();
      });
    });

    it('201 - with api key + data ok', function (done) {
      doRequest(agent, 'post', route, null, null, { apikey: _apikey }, function(err, res) {
        expect(res.statusCode).to.eqls(201);
        expect(res.body).to.have.all.keys(['token', 'user']);
        expect(res.body.token).to.have.all.keys(['tokenType', 'accessToken', 'refreshToken', 'expiresIn']);
        expect(res.body.user).to.not.haveOwnProperty('password');
        expect(res.body.user).to.not.haveOwnProperty('apikey');
        done();
      });
    });
    
  });

  describe('POST /api/v1/auth/logout', function() {

    const route = '/api/v1/auth/logout';
  
    it('403 - no user to logout', function(done) {
      doRequest(agent, 'post', route, null, null, {}, function(err, res) {
        expect(res.statusCode).to.eqls(403);
        done();
      });
    });

    it('204 - refresh token revoked', function(done) {
      doRequest(agent, 'post', route, null, _loggedAccessToken, {}, function(err, res) {
        expect(res.statusCode).to.eqls(204);
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

      let stub;

      beforeEach(() => {
        stub = sinon.stub(Guard.Guard, 'oAuthentify');
      });

      afterEach(() => {
        stub.restore();
      });

      it(`400 - code is required`, function (done) {
        doQueryRequest(agent, `/api/v1/auth/${provider}/callback`, null, null, {}, function(err, res) {
          expect(res.statusCode).to.eqls(400);
          done();
        });
      });

      it(`400 - authentication failed because invalid code format`, (done) => {
        stub.callsFake((...args) => {
          args[4](args[0], args[1], args[2])( new Error('bad'), null )
          return ({ err: null, user: { username: 'YODA' } })
        });
        doQueryRequest(agent, `/api/v1/auth/${provider}/callback`, null, null, { code: 'thisisacode' }, function(err, res) {
          expect(res.statusCode).to.eqls(400);
          done();
        });
      });

      it(`403 - forbidden role`, (done) => {
        stub.callsFake((...args) => {
          args[4](args[0], args[1], args[2])( null, { username: 'YODA', role: 'supersayen' } )
          return ({ err: null, user: { username: 'YODA' } })
        });
        doQueryRequest(agent, `/api/v1/auth/${provider}/callback`, null, null, { code: 'thisisacode' }, function(err, res) {
          expect(res.statusCode).to.eqls(403);
          done();
        });
      });

      it(`404 - user not found at provider`, (done) => {
        stub.callsFake((...args) => {
          args[4](args[0], args[1], args[2])( null, null )
          return ({ err: null, user: { username: 'YODA' } })
        });
        doQueryRequest(agent, `/api/v1/auth/${provider}/callback`, null, null, { code: 'thisisacode' }, function(err, res) {
          expect(res.statusCode).to.eqls(404);
          done();
        });
      });

      it(`200 - credentials received`, (done) => {
        stub.callsFake((...args) => {
          args[4](args[0], args[1], args[2])( null, new User(_user) );
          return ({ err: null, user: new User(_user) })
        });
        doQueryRequest(agent, `/api/v1/auth/${provider}/callback`, null, null, { code: 'thisisacode' }, function(err, res) {
          expect(res.statusCode).to.eqls(200);
          expect(res.body).to.haveOwnProperty('token');
          expect(res.body.token).to.haveOwnProperty('tokenType');
          expect(res.body.token.tokenType).to.be.eqls('Bearer');
          expect(res.body).to.haveOwnProperty('user');
          _token = res.body.token.accessToken;
          _refreshToken = res.body.token.refreshToken;
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

    it('400 - refresh token not valid', function (done) {
      doRequest(agent, 'post', route, null, null, { token: { refreshToken: 123 } }, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('404 - refresh token not found', function (done) {
      doRequest(agent, 'post', route, null, null, { token: { refreshToken: '0' + _refreshToken.substring(1, _refreshToken.length -1) + '0' } }, function(err, res) {
        expect(res.statusCode).to.eqls(404);
        done();
      });
    });

    it('201 - data ok', function (done) {
      doRequest(agent, 'post', route, null, _token, { token: { refreshToken: _refreshToken } }, function(err, res) {
        expect(res.statusCode).to.eqls(201);
        expect(res.body).to.have.all.keys(['token']);
        expect(res.body.token).to.have.all.keys(['tokenType', 'accessToken', 'refreshToken', 'expiresIn']);
        done();
      });
    });

  });

  describe('PATCH /api/v1/auth/confirm', function() {

    const route = '/api/v1/auth/confirm';
  
    it('400 - token is required', function(done) {
      doRequest(agent, 'patch', route, null, null, {}, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('400 - token not valid', function(done) {
      doRequest(agent, 'patch', route, null, null, { token: 777 }, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('400 - token not valid', function(done) {

      doRequest(agent, 'patch', route, null, null, { token: 'readmeimatoken' }, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });

    });

    it('200 - user status confirmed', function(done) {
      doRequest(agent, 'patch', route, null, null, { token: _loggedAccessToken }, function(err, res) {
        expect(res.statusCode).to.eqls(200);
        done();
      });
    });

  });

  describe('GET /api/v1/auth/request-password', function() {

    const route = '/api/v1/auth/request-password';
  
    it('400 - email is required', function(done) {

      doRequest(agent, 'get', route, null, null, {}, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });

    });

    it('400 - email should be well formed email address', function(done) {

      doRequest(agent, 'get', route, null, null, { email: 'imnotanemail' }, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });


    });

  });

});