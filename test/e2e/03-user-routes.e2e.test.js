// --- Test modules

const request = require('supertest');
const chance = require('chance').Chance();

const { clone } = require('lodash');
const { expect } = require('chai');

// --- API server

let { server } = require(process.cwd() + '/dist/api/app.bootstrap');

// --- Test utils

const { user } = require(process.cwd() + '/test/utils/fixtures');
const { doRequest, doQueryRequest, dataOk, pools } = require(process.cwd() + '/test/utils');

describe('User routes', function () {
  
  let agent, _admin, _adminToken, _unauthorizedToken, _user, _createdByAdminUser;

  before(function (done) {

    agent = request.agent(server);

    // Log admin
    doRequest(agent, 'post', '/api/v1/auth/login', null, null, { email: 'admin@typeplatexample.com', password: 'passw0rd' }, function(err, res) {
      _adminToken = res.body.token.accessToken;
      _admin = res.body.user;
      doRequest(agent, 'post', '/api/v1/auth/register', null, null, user.register('passw0rd'), function(err, res) {
        _unauthorizedToken = res.body.token.accessToken;
        _user = res.body.user;
        done();
      });
    });

  });
  
  after(function () {
    server.close();
    delete server;
  });

  describe('POST /api/v1/users', () => {

    it('400 - empty payload', function (done) {
      doRequest(agent, 'post', '/api/v1/users', null, _adminToken, {}, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });
  
    it('400 - username too long', function (done) {
      const params = clone(user.entity('passw0rd'));
      params.username = chance.string({ length: 33, pool: pools.username })
      doRequest(agent, 'post', '/api/v1/users', null, _adminToken, params, function(err, res) {
        expect(res.body.statusCode).to.eqls(400);
        expect(res.body.errors[0]).to.eqls('\'username\' length must be less than or equal to 32 characters long');
        done();
      });
    });
  
    it('400 - bad email', function (done) {
      const params = clone(user.entity('passw0rd'));
      params.email = 'imnotenemail';
      doRequest(agent, 'post', '/api/v1/users', null, _adminToken, params, function(err, res) {
        expect(res.body.statusCode).to.eqls(400);
        expect(res.body.errors[0]).to.eqls('\'email\' must be a valid email');
        done();
      });
    });
  
    it('400 - password too long', function (done) {
      const params = clone(user.entity('passw0rd'));
      params.password = 'abcdefghijklmnopqrstuvwxyz';
      doRequest(agent, 'post', '/api/v1/users', null, _adminToken, params, function(err, res) {
        expect(res.body.statusCode).to.eqls(400);
        expect(res.body.errors[0]).to.eqls('\'password\' length must be less than or equal to 16 characters long');
        done();
      });
    });
  
    it('400 - password too short', function (done) {
      const params = clone(user.entity('passw0rd'));
      params.password = 'abc';
      doRequest(agent, 'post', '/api/v1/users', null, _adminToken, params, function(err, res) {
        expect(res.body.statusCode).to.eqls(400);
        expect(res.body.errors[0]).to.eqls('\'password\' length must be at least 8 characters long');
        done();
      });
    });
  
    it('403 - no bearer', function (done) {
      const params = clone(user.entity('passw0rd'));
      doRequest(agent, 'post', '/api/v1/users', null, null, params, function(err, res) {
        expect(res.statusCode).to.eqls(403);
        done();
      });
    });
  
    it('403 - permission denied', function (done) {
      const params = clone(user.entity('passw0rd'));
      doRequest(agent, 'post', '/api/v1/users', null, _unauthorizedToken, params, function(err, res) {
        expect(res.statusCode).to.eqls(403);
        done();
      });
    });
  
    it('201 - data ok', function (done) {
      const params = clone(user.entity('passw0rd'));
      doRequest(agent, 'post', '/api/v1/users', null, _adminToken, params, function(err, res) {
        expect(res.statusCode).to.eqls(201);
        dataOk(res, 'user', 'create');
        _createdByAdminUser = res.body;
        done();
      });
    });

  });
  
  describe('GET /api/v1/users/profile', () => {
    it('403 - no bearer', function (done) {
      doQueryRequest(agent, '/api/v1/users/profile', null, null, {}, function(err, res) {
        expect(res.statusCode).to.eqls(403);
        done();
      });
    });
  
    it('200 - data ok', function (done) {
      doQueryRequest(agent, '/api/v1/users/profile', null, _adminToken, {}, function(err, res) {
        expect(res.statusCode).to.eqls(200);
        dataOk(res, 'user', 'read');
        done();
      });
    });
  });

  describe('GET /api/v1/users/:id', () => {

    it('403 - no bearer', function (done) {
      doQueryRequest(agent, '/api/v1/users/1', null, null, {}, function(err, res) {
        expect(res.statusCode).to.eqls(403);
        done();
      });
    });
  
    it('403 - permission denied', function (done) {
      doQueryRequest(agent, '/api/v1/users/1', null, _unauthorizedToken, {}, function(err, res) {
        expect(res.statusCode).to.eqls(403);
        done();
      });
    });
  
    it('404 - user not found', function (done) {
      doQueryRequest(agent, '/api/v1/users/9999', null, _adminToken, {}, function(err, res) {
        expect(res.statusCode).to.eqls(404);
        done();
      });
    });
  
    it('404 - user not found because userId is not a number', function (done) {
      doQueryRequest(agent, '/api/v1/users/a', null, _adminToken, {}, function(err, res) {
        expect(res.statusCode).to.eqls(404);
        done();
      });
    });
    
    it('200 - data ok', function (done) {
      doQueryRequest(agent, '/api/v1/users/1', null, _adminToken, {}, function(err, res) {
        expect(res.statusCode).to.eqls(200);
        dataOk(res, 'user', 'read');
        done();
      });
    });
  });

  describe('GET /api/v1/users', () => {

    it('400 - malformed email', function (done) {
      doQueryRequest(agent, '/api/v1/users', null, _adminToken, { email: 'thisisnotanemail' }, function(err, res) {
        expect(res.body.statusCode).to.eqls(400);
        expect(res.body.errors[0]).to.eqls('\'email\' must be a valid email');
        done();
      });
    });
  
    it('400 - username too long', function (done) {
      doQueryRequest(agent, '/api/v1/users', null, _adminToken, { username: chance.string({ length: 33, pool: pools.username }) }, function(err, res) {
        expect(res.body.statusCode).to.eqls(400);
        expect(res.body.errors[0]).to.eqls('\'username\' length must be less than or equal to 32 characters long');
        done();
      });
    });
  
    it('400 - unknown role', function (done) {
      doQueryRequest(agent, '/api/v1/users', null, _adminToken, { role: 'tester' }, function(err, res) {
        expect(res.body.statusCode).to.eqls(400);
        expect(res.body.errors[0]).to.eqls('\'role\' must be one of [admin, user, ghost]');
        done();
      });
    });
  
    it('403 - no bearer', function (done) {
      doQueryRequest(agent, '/api/v1/users', null, null, {}, function(err, res) {
        expect(res.statusCode).to.eqls(403);
        done();
      });
    });
  
    it('403 - permission denied', function (done) {
      doQueryRequest(agent, '/api/v1/users', null, _unauthorizedToken, {}, function(err, res) {
        expect(res.statusCode).to.eqls(403);
        done();
      });
    });
  
    it('200 - data ok', function (done) {
      doQueryRequest(agent, '/api/v1/users', null, _adminToken, {}, function(err, res) {
        expect(res.statusCode).to.eqls(200);
        expect(res.body.data).satisfy(function(value) {
          return Array.isArray(value) && value.length > 0;
        });
        expect(res.body.data).satisfy(function(value) {
          return value.map( (entry) => {
            const data = { body: entry };
            dataOk(data, 'user', 'read')
          })
        });
        done();
      });
    });
  
    it('200 - pagination get 30 results by default', function (done) {
      doQueryRequest(agent, '/api/v1/users', null, _adminToken, {}, function(err, res) {
        expect(res.statusCode).to.eqls(200);
        expect(res.body.data).length.lte(30);
        done();
      });
    });
  
    it('200 - pagination get n results by query param', function (done) {
      doQueryRequest(agent, '/api/v1/users', null, _adminToken, { perPage: 50 }, function(err, res) {
        expect(res.statusCode).to.eqls(200);
        expect(res.body.data).length.lte(50);
        done();
      });
    });
  
    it('200 - results matches on username', function (done) {
      doQueryRequest(agent, '/api/v1/users', null, _adminToken, { username: _user.username }, function(err, res) {
        expect(res.statusCode).to.eqls(200);
        expect(res.body.data.shift().username).to.equals(_user.username);
        done();
      });
    });
  
    it('200 - results matches on email', function (done) {
      doQueryRequest(agent, '/api/v1/users', null, _adminToken, { email: _user.email }, function(err, res) {
        expect(res.statusCode).to.eqls(200);
        expect(res.body.data.shift().email).to.equals(_user.email);
        done();
      });
    });
  
    it('200 - results matches on role', function (done) {
      doQueryRequest(agent, '/api/v1/users', null, _adminToken, { role: _user.role }, function(err, res) {
        expect(res.statusCode).to.eqls(200);
        expect(res.body.data.shift().role).to.equals(_user.role);
        done();
      });
    });

  });

  describe('PUT /api/v1/users/:id ', () => {

    it('400 - empty payload', function (done) {
      doRequest(agent, 'put', '/api/v1/users/', 1, _adminToken, {}, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });
  
    it('400 - username too long', function (done) {
      const params = clone(user.entity('passw0rd'));
      params.username = chance.string({ length: 33, pool: pools.username });
      doRequest(agent, 'put', '/api/v1/users/', _createdByAdminUser.id, _adminToken, params, function(err, res) {
        expect(res.body.statusCode).to.eqls(400);
        expect(res.body.errors[0]).to.eqls('\'username\' length must be less than or equal to 32 characters long');
        done();
      });
    });
  
    it('400 - bad email', function (done) {
      const params = clone(user.entity('passw0rd'));
      params.email = 'imnotanemail'
      doRequest(agent, 'put', '/api/v1/users/', _createdByAdminUser.id, _adminToken, params, function(err, res) {
        expect(res.body.statusCode).to.eqls(400);
        expect(res.body.errors[0]).to.eqls('\'email\' must be a valid email');
        done();
      });
    });
  
    it('400 - password too long', function (done) {
      const params = clone(user.entity('passw0rd'));
      params.password = 'abcdefghijklmnopqrstuvwxyzdsqddqddsqdsqd';
      doRequest(agent, 'put', '/api/v1/users/', _createdByAdminUser.id, _adminToken, params, function(err, res) {
        expect(res.body.statusCode).to.eqls(400);
        expect(res.body.errors[0]).to.eqls('\'password\' length must be less than or equal to 16 characters long');
        done();
      });
    });
  
    it('400 - password too short', function (done) {
      const params = clone(user.entity('passw0rd'));
      params.password = 'abc';
      doRequest(agent, 'put', '/api/v1/users/', _createdByAdminUser.id, _adminToken, params, function(err, res) {
        expect(res.body.statusCode).to.eqls(400);
        expect(res.body.errors[0]).to.eqls('\'password\' length must be at least 8 characters long');
        done();
      });
    });
  
    it('400 - fieldname not valid and should be avatar', function (done) {
      const params = clone(user.entity('passw0rd'));
      agent['put'](`/api/v1/users/${_createdByAdminUser.id}`)
        .set('Authorization', 'Bearer ' + _adminToken)
        .set('Accept', process.env.CONTENT_TYPE)
        .set('Content-Type', 'multipart/form-data')
        .set('Origin', process.env.ORIGIN)
        .field('username', params.username)
        .field('email', params.email)
        .field('password', params.password)
        .attach('pictures', process.cwd() + '/test/utils/fixtures/files/javascript.jpg')
        .end(function(err, res) {
          expect(res.statusCode).to.eqls(400);
          done();
        });
    });

    it('400 - mimetype not valid and should be img mimetype', function (done) {
      const params = clone(user.entity('passw0rd'));
      agent['put'](`/api/v1/users/${_createdByAdminUser.id}`)
        .set('Authorization', 'Bearer ' + _adminToken)
        .set('Accept', process.env.CONTENT_TYPE)
        .set('Content-Type', 'multipart/form-data')
        .set('Origin', process.env.ORIGIN)
        .field('username', params.username)
        .field('email', params.email)
        .field('password', params.password)
        .attach('avatar', process.cwd() + '/test/utils/fixtures/files/documents.rar')
        .end(function(err, res) {
          expect(res.statusCode).to.eqls(400);
          done();
        });
    });

    it('403 - no bearer', function (done) {
      const params = clone(user.entity('passw0rd'));
      doRequest(agent, 'put', '/api/v1/users/', _createdByAdminUser.id, null, params, function(err, res) {
        expect(res.statusCode).to.eqls(403);
        done();
      });
    });
  
    it('403 - permission denied', function (done) {
      const params = clone(user.entity('passw0rd'));
      doRequest(agent, 'put', '/api/v1/users/', _createdByAdminUser.id, _unauthorizedToken, params, function(err, res) {
        expect(res.statusCode).to.eqls(403);
        done();
      });
    });
  
    it('404 - user not found', function (done) {
      const params = clone(user.entity('passw0rd'));
      doRequest(agent, 'put', '/api/v1/users/', 9999, _adminToken, params, function(err, res) {
        expect(res.statusCode).to.eqls(404);
        done();
      });
    });
  
    it('404 - user not found because userId is not a number', function (done) {
      const params = clone(user.entity('passw0rd'));
      doRequest(agent, 'put', '/api/v1/users/a', null, _adminToken, params, function(err, res) {
        expect(res.statusCode).to.eqls(404);
        done();
      });
    });
  
    it('200 - data ok', function (done) {
      const params = clone(user.entity('passw0rd'));
      doRequest(agent, 'put', '/api/v1/users/', _createdByAdminUser.id, _adminToken, params, function(err, res) {
        expect(res.statusCode).to.eqls(200);
        dataOk(res, 'user', 'update');
        done();
      });
    });

    it('200 - data ok with avatar by admin', function (done) {
      const params = clone(user.entity('passw0rd'));
      agent['put'](`/api/v1/users/${_createdByAdminUser.id}`)
        .set('Authorization', 'Bearer ' + _adminToken)
        .set('Accept', process.env.CONTENT_TYPE)
        .set('Content-Type', 'multipart/form-data')
        .set('Origin', process.env.ORIGIN)
        .field('username', params.username)
        .field('status', params.status)
        .field('email', params.email)
        .field('role', 'user')
        .field('password', params.password)
        .attach('avatar', process.cwd() + '/test/utils/fixtures/files/javascript.jpg')
        .end(function(err, res) {
          expect(res.statusCode).to.eqls(200);
          dataOk( { body: res.body }, 'user', 'update')
          done();
        });
    });

  });


  describe('PATCH /api/v1/users/:id ', () => {

    it('400 - username too long', function (done) {
      const params = clone(user.entity('passw0rd'));
      params.username = chance.string({ length: 33, pool: pools.username });
      doRequest(agent, 'patch', '/api/v1/users/', _createdByAdminUser.id, _adminToken, params, function(err, res) {
        expect(res.body.statusCode).to.eqls(400);
        expect(res.body.errors[0]).to.eqls('\'username\' length must be less than or equal to 32 characters long');
        done();
      });
    });
  
    it('400 - bad email', function (done) {
      const params = clone(user.entity('passw0rd'));
      params.email = 'imnotanemail';
      doRequest(agent, 'patch', '/api/v1/users/', _createdByAdminUser.id, _adminToken, params, function(err, res) {
        expect(res.body.statusCode).to.eqls(400);
        expect(res.body.errors[0]).to.eqls('\'email\' must be a valid email');
        done();
      });
    });
  
    it('400 - password too long', function (done) {
      const params = clone(user.entity('passw0rd'));
      params.password = '123456789abcdefgh123456789';
      doRequest(agent, 'patch', '/api/v1/users/', _createdByAdminUser.id, _adminToken, params, function(err, res) {
        expect(res.body.statusCode).to.eqls(400);
        expect(res.body.errors[0]).to.eqls('\'password\' length must be less than or equal to 16 characters long');
        done();
      });
    });
  
    it('400 - password too short', function (done) {
      const params = clone(user.entity('passw0rd'));
      params.password = '123';
      doRequest(agent, 'patch', '/api/v1/users/', _createdByAdminUser.id, _adminToken, params, function(err, res) {
        expect(res.body.statusCode).to.eqls(400);
        expect(res.body.errors[0]).to.eqls('\'password\' length must be at least 8 characters long');
        done();
      });
    });
  
    it('400 - confirm password is required', function (done) {
      const params = clone(user.entity('passw0rd'));
      params.password = 'a1b2c3d4';
      doRequest(agent, 'patch', '/api/v1/users/', _createdByAdminUser.id, _adminToken, params, function(err, res) {
        expect(res.body.statusCode).to.eqls(400);
        expect(res.body.errors[0]).to.eqls('\'Confirm password\' is required');
        done();
      });
    });

    it('400 - password to revoke is required', function (done) {
      const params = clone(user.entity('passw0rd'));
      params.password = 'a1b2c3d4';
      params.passwordConfirmation = 'a1b2c3d4';
      params.isUpdatePassword = true;
      doRequest(agent, 'patch', '/api/v1/users/', _createdByAdminUser.id, _adminToken, params, function(err, res) {
        expect(res.body.statusCode).to.eqls(400);
        expect(res.body.errors[0]).to.eqls('\'passwordToRevoke\' is required');
        done();
      });
    });

    it('400 - password to revoke does not match', function (done) {
      const params = clone(user.entity('passw0rd'));
      params.password = 'a1b2c3d4';
      params.passwordConfirmation = 'a1b2c3d4';
      params.passwordToRevoke = 'passw1rd';
      params.isUpdatePassword = true;
      doRequest(agent, 'patch', '/api/v1/users/', _createdByAdminUser.id, _adminToken, params, function(err, res) {
        expect(res.body.statusCode).to.eqls(403);
        expect(res.body.errors[0]).to.eqls('Password to revoke does not match');
        done();
      });
    });

    it('400 - fieldname not valid and should be avatar', function (done) {
      const params = clone(user.entity('passw0rd'));
      agent['patch'](`/api/v1/users/${_createdByAdminUser.id}`)
        .set('Authorization', 'Bearer ' + _adminToken)
        .set('Accept', process.env.CONTENT_TYPE)
        .set('Content-Type', 'multipart/form-data')
        .set('Origin', process.env.ORIGIN)
        .field('username', params.username)
        .field('email', params.email)
        .field('password', params.password)
        .field('passwordConfirmation', params.password)
        .attach('pictures', process.cwd() + '/test/utils/fixtures/files/javascript.jpg')
        .end(function(err, res) {
          expect(res.statusCode).to.eqls(400);
          done();
        });
    });

    it('400 - mimetype not valid and should be img mimetype', function (done) {
      const params = clone(user.entity('passw0rd'));
      agent['patch'](`/api/v1/users/${_createdByAdminUser.id}`)
        .set('Authorization', 'Bearer ' + _adminToken)
        .set('Accept', process.env.CONTENT_TYPE)
        .set('Content-Type', 'multipart/form-data')
        .set('Origin', process.env.ORIGIN)
        .field('username', params.username)
        .field('email', params.email)
        .field('password', params.password)
        .field('passwordConfirmation', params.password)
        .attach('avatar', process.cwd() + '/test/utils/fixtures/files/documents.rar')
        .end(function(err, res) {
          expect(res.statusCode).to.eqls(400);
          done();
        });
    });

    it('403 - no bearer', function (done) {
      const params = clone(user.entity('passw0rd'));
      doRequest(agent, 'patch', '/api/v1/users/', _createdByAdminUser.id, null, params, function(err, res) {
        expect(res.statusCode).to.eqls(403);
        done();
      });
    });
  
    it('403 - permission denied', function (done) {
      const params = clone(user.entity('passw0rd'));
      doRequest(agent, 'patch', '/api/v1/users/', _createdByAdminUser.id, _unauthorizedToken, params, function(err, res) {
        expect(res.statusCode).to.eqls(403);
        done();
      });
    });
  
    it('404 - user not found', function (done) {
      const params = clone(user.entity('passw0rd'));
      params.passwordConfirmation = params.password;
      doRequest(agent, 'patch', '/api/v1/users/', 9999, _adminToken, params, function(err, res) {
        expect(res.statusCode).to.eqls(404);
        done();
      });
    });
  
    it('404 - user not found because userId is not a number', function (done) {
      const params = clone(user.entity('passw0rd'));
      doRequest(agent, 'patch', '/api/v1/users/a', null, _adminToken, params, function(err, res) {
        expect(res.statusCode).to.eqls(404);
        done();
      });
    });
  
    it('200 - data ok', function (done) {
      const params = clone(user.entity('passw0rd'));
      params.passwordConfirmation = params.password;
      doRequest(agent, 'patch', '/api/v1/users/', _createdByAdminUser.id, _adminToken, params, function(err, res) {
        expect(res.statusCode).to.eqls(200);
        dataOk(res, 'user', 'update');
        done();
      });
    });

    it('200 - data ok with avatar by admin', function (done) {
      const params = clone(user.entity('passw0rd'));
      agent['patch'](`/api/v1/users/${_createdByAdminUser.id}`)
        .set('Authorization', 'Bearer ' + _adminToken)
        .set('Accept', process.env.CONTENT_TYPE)
        .set('Content-Type', 'multipart/form-data')
        .set('Origin', process.env.ORIGIN)
        .field('username', params.username)
        .field('email', params.email)
        .field('password', params.password)
        .field('passwordConfirmation', params.password)
        .attach('avatar', process.cwd() + '/test/utils/fixtures/files/javascript.jpg')
        .end(function(err, res) {
          expect(res.statusCode).to.eqls(200);
          dataOk( { body: res.body }, 'user', 'update')
          done();
        });
    });

  });

  describe('DELETE /api/v1/users/:id ', () => {

    it('403 - no bearer', function (done) {
      request(server)
        .delete('/api/v1/users/1')
        .set('Accept', process.env.CONTENT_TYPE)
        .set('Origin', process.env.ORIGIN)
        .set('Content-Type', process.env.CONTENT_TYPE)
        .expect(403, done);
    });
  
    it('403 - permission denied', function (done) {
      request(server)
        .delete('/api/v1/users/1')
        .set('Accept', process.env.CONTENT_TYPE)
        .set('Origin', process.env.ORIGIN)
        .set('Content-Type', process.env.CONTENT_TYPE)
        .set('Authorization', 'Bearer ' + _unauthorizedToken)
        .expect(403, done);
    });
  
    it('404 - user not found', function (done) {
      agent
        .delete('/api/v1/users/9999')
        .set('Accept', process.env.CONTENT_TYPE)
        .set('Origin', process.env.ORIGIN)
        .set('Content-Type', process.env.CONTENT_TYPE)
        .set('Authorization', 'Bearer ' + _adminToken)
        .expect(404, done);
    });
  
    it('417 - userId is not a number', function (done) {
      agent
        .delete('/api/v1/users/a')
        .set('Accept', process.env.CONTENT_TYPE)
        .set('Origin', process.env.ORIGIN)
        .set('Content-Type', process.env.CONTENT_TYPE)
        .set('Authorization', 'Bearer ' + _adminToken)
        .expect(417, done);
    });
  
    it('204', function (done) {
      agent
        .delete('/api/v1/users/' + _createdByAdminUser.id)
        .set('Accept', process.env.CONTENT_TYPE)
        .set('Origin', process.env.ORIGIN)
        .set('Content-Type', process.env.CONTENT_TYPE)
        .set('Authorization', 'Bearer ' + _adminToken)
        .expect(204, done);
    });
  
  });

});