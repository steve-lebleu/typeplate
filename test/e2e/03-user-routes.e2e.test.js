// --- Test modules

var request = require('supertest');
var chance = require('chance').Chance();

var { expect } = require('chai');

// --- API server

var { server } = require(process.cwd() + '/dist/api/app.bootstrap');

// --- Test utils

var fixtures = require(process.cwd() + '/test/utils/fixtures');
var { doRequest, doQueryRequest, dataOk, pools, expectations } = require(process.cwd() + '/test/utils');

describe('User routes', function () {
  
  var agent, password, credentials, token, unauthorizedToken, authenticatedUser;

  before(function (done) {

    agent       = request.agent(server);
    password    = 'e2q2mak7';
    credentials = fixtures.user.entity('admin', password);

    doRequest(agent, 'post', '/api/v1/auth/register', null, null, credentials, 201, function(err, res) {
      expect(res.statusCode).to.eqls(201);
      token = res.body.token.accessToken;
      doRequest(agent, 'post', '/api/v1/auth/register', null, null, fixtures.user.entity('user', password), 201, function(err, res) {
        expect(res.statusCode).to.eqls(201);
        unauthorizedToken = res.body.token.accessToken;
        done();
      });
    });

  });
  
  after(function () {
    server.close();
    server = undefined;
    delete server;
  });

  it('POST /api/v1/users 400 - empty payload', function (done) {
    doRequest(agent, 'post', '/api/v1/users', null, token, {}, 400, function(err, res) {
      expect(res.statusCode).to.eqls(400);
      done();
    });
  });

  it('POST /api/v1/users 400 - username too long', function (done) {
    const user = fixtures.user.entity('admin');
    user.username = chance.string({ length: 33, pool: pools.username })
    doRequest(agent, 'post', '/api/v1/users', null, token, user, 400, function(err, res) {
      expect(res.body.statusCode).to.eqls(400);
      expect(res.body.errors[0]).to.eqls('\'username\' length must be less than or equal to 32 characters long');
      done();
    });
  });

  it('POST /api/v1/users 400 - bad email', function (done) {
    const user = fixtures.user.entity('admin', null, false);
    user.email = 'imnotenemail';
    doRequest(agent, 'post', '/api/v1/users', null, token, user, 400, function(err, res) {
      expect(res.body.statusCode).to.eqls(400);
      expect(res.body.errors[0]).to.eqls('\'email\' must be a valid email');
      done();
    });
  });

  it('POST /api/v1/users 400 - password too long', function (done) {
    const user = fixtures.user.entity('admin', 'abcdefghijklmnopqrstuvwxyz');
    doRequest(agent, 'post', '/api/v1/users', null, token, user, 400, function(err, res) {
      expect(res.body.statusCode).to.eqls(400);
      expect(res.body.errors[0]).to.eqls('\'password\' length must be less than or equal to 16 characters long');
      done();
    });
  });

  it('POST /api/v1/users 400 - password too short', function (done) {
    const user = fixtures.user.entity('admin', 'abc');
    doRequest(agent, 'post', '/api/v1/users', null, token, user, 400, function(err, res) {
      expect(res.body.statusCode).to.eqls(400);
      expect(res.body.errors[0]).to.eqls('\'password\' length must be at least 8 characters long');
      done();
    });
  });

  it('POST /api/v1/users 403 - no bearer', function (done) {
    const user = fixtures.user.entity('admin', chance.hash({ length: 8 }));
    doRequest(agent, 'post', '/api/v1/users', null, null, user, 403, function(err, res) {
      expect(res.statusCode).to.eqls(403);
      done();
    });
  });

  it('POST /api/v1/users 403 - permission denied', function (done) {
    const user = fixtures.user.entity('admin', chance.hash({ length: 8 }));
    doRequest(agent, 'post', '/api/v1/users', null, unauthorizedToken, user, 403, function(err, res) {
      expect(res.statusCode).to.eqls(403);
      done();
    });
  });

  it('POST /api/v1/users 201 - data ok', function (done) {
    const user = fixtures.user.entity('user', password);
    doRequest(agent, 'post', '/api/v1/users', null, token, user, 201, function(err, res) {
      expect(res.statusCode).to.eqls(201);
      dataOk(res, 'user', 'create');
      authenticatedUser = res.body;
      done();
    });
  });
  
  it('GET /api/v1/users/profile 403 - no bearer', function (done) {
    doQueryRequest(agent, '/api/v1/users/profile', null, null, {}, 403, function(err, res) {
      expect(res.statusCode).to.eqls(403);
      done();
    });
  });

  it('GET /api/v1/users/profile 200 - data ok', function (done) {
    doQueryRequest(agent, '/api/v1/users/profile', null, token, {}, 200, function(err, res) {
      expect(res.statusCode).to.eqls(200);
      // dataOk(res, 'user', 'read');
      done();
    });
  });

  it('GET /api/v1/users/:id 403 - no bearer', function (done) {
    doQueryRequest(agent, '/api/v1/users/1', null, null, {}, 403, function(err, res) {
      expect(res.statusCode).to.eqls(403);
      done();
    });
  });

  it('GET /api/v1/users/:id 403 - permission denied', function (done) {
    doQueryRequest(agent, '/api/v1/users/1', null, unauthorizedToken, {}, 403, function(err, res) {
      expect(res.statusCode).to.eqls(403);
      done();
    });
  });

  it('GET /api/v1/users/:id 404 - user not found', function (done) {
    doQueryRequest(agent, '/api/v1/users/9999', null, token, {}, 404, function(err, res) {
      expect(res.statusCode).to.eqls(404);
      done();
    });
  });

  it('GET /api/v1/users/:id 404 - user not found because userId is not a number', function (done) {
    doQueryRequest(agent, '/api/v1/users/a', null, token, {}, 404, function(err, res) {
      expect(res.statusCode).to.eqls(404);
      done();
    });
  });
  
  it('GET /api/v1/users/:id 200 - data ok', function (done) {
    doQueryRequest(agent, '/api/v1/users/1', null, token, {}, 200, function(err, res) {
      expect(res.statusCode).to.eqls(200);
      dataOk(res, 'user', 'read');
      done();
    });
  });

  it('GET /api/v1/users 400 - malformed email', function (done) {
    doQueryRequest(agent, '/api/v1/users', null, token, { email: 'thisisnotanemail' }, 400, function(err, res) {
      expect(res.body.statusCode).to.eqls(400);
      expect(res.body.errors[0]).to.eqls('\'email\' must be a valid email');
      done();
    });
  });

  it('GET /api/v1/users 400 - username too long', function (done) {
    doQueryRequest(agent, '/api/v1/users', null, token, { username: chance.string({ length: 33, pool: pools.username }) }, 400, function(err, res) {
      expect(res.body.statusCode).to.eqls(400);
      expect(res.body.errors[0]).to.eqls('\'username\' length must be less than or equal to 32 characters long');
      done();
    });
  });

  it('GET /api/v1/users 400 - unknown role', function (done) {
    doQueryRequest(agent, '/api/v1/users', null, token, { role: 'tester' }, 400, function(err, res) {
      expect(res.body.statusCode).to.eqls(400);
      expect(res.body.errors[0]).to.eqls('\'role\' must be one of [admin, user, ghost]');
      done();
    });
  });

  it('GET /api/v1/users 403 - no bearer', function (done) {
    doQueryRequest(agent, '/api/v1/users', null, null, {}, 403, function(err, res) {
      expect(res.statusCode).to.eqls(403);
      done();
    });
  });

  it('GET /api/v1/users 403 - permission denied', function (done) {
    doQueryRequest(agent, '/api/v1/users', null, unauthorizedToken, {}, 403, function(err, res) {
      expect(res.statusCode).to.eqls(403);
      done();
    });
  });

  it('GET /api/v1/users 200 - data ok', function (done) {
    doQueryRequest(agent, '/api/v1/users', null, token, {}, 200, function(err, res) {
      expect(res.statusCode).to.eqls(200);
      expect(res.body).satisfy(function(value) {
        return Array.isArray(value) && value.length > 0;
      });
      expect(res.body).satisfy(function(value) {
        return value.map( (entry) => {
          const data = { body: entry };
          dataOk(data, 'user', 'read')
        })
      });
      done();
    });
  });

  it('GET /api/v1/users 200 - pagination get 30 results by default', function (done) {
    doQueryRequest(agent, '/api/v1/users', null, token, {}, 200, function(err, res) {
      expect(res.statusCode).to.eqls(200);
      expect(res.body).length.lte(30);
      done();
    });
  });

  it('GET /api/v1/users 200 - pagination get n results by query param', function (done) {
    doQueryRequest(agent, '/api/v1/users', null, token, { perPage: 50 }, 200, function(err, res) {
      expect(res.statusCode).to.eqls(200);
      expect(res.body).length.lte(50);
      done();
    });
  });

  it('GET /api/v1/users 200 - results matches on username', function (done) {
    doQueryRequest(agent, '/api/v1/users', null, token, { username: user.username }, 200, function(err, res) {
      expect(res.statusCode).to.eqls(200);
      expect(res.body.shift().username).to.equals(user.username);
      done();
    });
  });

  it('GET /api/v1/users 200 - results matches on email', function (done) {
    doQueryRequest(agent, '/api/v1/users', null, token, { email: user.email }, 200, function(err, res) {
      expect(res.statusCode).to.eqls(200);
      expect(res.body.shift().email).to.equals(user.email);
      done();
    });
  });

  it('GET /api/v1/users 200 - results matches on role', function (done) {
    doQueryRequest(agent, '/api/v1/users', null, token, { role: user.role }, 200, function(err, res) {
      expect(res.statusCode).to.eqls(200);
      expect(res.body.shift().role).to.equals(user.role);
      done();
    });
  });

  it('PUT /api/v1/users/:id 400 - empty payload', function (done) {
    doRequest(agent, 'put', '/api/v1/users/', 1, token, {}, 400, function(err, res) {
      expect(res.statusCode).to.eqls(400);
      done();
    });
  });

  it('PUT /api/v1/users/:id 400 - username too long', function (done) {
    const user = fixtures.user.entity('user');
    user.username = chance.string({ length: 33, pool: pools.username });
    doRequest(agent, 'put', '/api/v1/users/', authenticatedUser.id, token, user, 400, function(err, res) {
      expect(res.body.statusCode).to.eqls(400);
      expect(res.body.errors[0]).to.eqls('\'username\' length must be less than or equal to 32 characters long');
      done();
    });
  });

  it('PUT /api/v1/users/:id 400 - bad email', function (done) {
    const user = fixtures.user.entity('user');
    user.email = 'imnotanemail'
    doRequest(agent, 'put', '/api/v1/users/', authenticatedUser.id, token, user, 400, function(err, res) {
      expect(res.body.statusCode).to.eqls(400);
      expect(res.body.errors[0]).to.eqls('\'email\' must be a valid email');
      done();
    });
  });

  it('PUT /api/v1/users/:id 400 - password too long', function (done) {
    const user = fixtures.user.entity('user', 'abcdefghijklmnopqrstuvwxyzdsqddqddsqdsqd');
    doRequest(agent, 'put', '/api/v1/users/', authenticatedUser.id, token, user, 400, function(err, res) {
      expect(res.body.statusCode).to.eqls(400);
      expect(res.body.errors[0]).to.eqls('\'password\' length must be less than or equal to 16 characters long');
      done();
    });
  });

  it('PUT /api/v1/users/:id 400 - password too short', function (done) {
    const user = fixtures.user.entity('user', 'abc');
    doRequest(agent, 'put', '/api/v1/users/', authenticatedUser.id, token, user, 400, function(err, res) {
      expect(res.body.statusCode).to.eqls(400);
      expect(res.body.errors[0]).to.eqls('\'password\' length must be at least 8 characters long');
      done();
    });
  });

  it('PUT /api/v1/users/:id 403 - no bearer', function (done) {
    const user = fixtures.user.entity('user');
    doRequest(agent, 'put', '/api/v1/users/', authenticatedUser.id, null, user, 403, function(err, res) {
      expect(res.statusCode).to.eqls(403);
      done();
    });
  });

  it('PUT /api/v1/users/:id 403 - permission denied', function (done) {
    const user = fixtures.user.entity('user');
    doRequest(agent, 'put', '/api/v1/users/', authenticatedUser.id, unauthorizedToken, user, 403, function(err, res) {
      expect(res.statusCode).to.eqls(403);
      done();
    });
  });

  it('PUT /api/v1/users/:id 404 - user not found', function (done) {
    const user = fixtures.user.entity('user');
    doRequest(agent, 'put', '/api/v1/users/', 9999, token, user, 404, function(err, res) {
      expect(res.statusCode).to.eqls(404);
      done();
    });
  });

  it('PUT /api/v1/users/:id 404 - user not found because userId is not a number', function (done) {
    const user = fixtures.user.entity('user');
    doRequest(agent, 'put', '/api/v1/users/a', null, token, user, 404, function(err, res) {
      expect(res.statusCode).to.eqls(404);
      done();
    });
  });

  it('PUT /api/v1/users/:id 200 - data ok', function (done) {
    const user = fixtures.user.entity('user');
    doRequest(agent, 'put', '/api/v1/users/', authenticatedUser.id, token, user, 200, function(err, res) {
      expect(res.statusCode).to.eqls(200);
      dataOk(res, 'user', 'update');
      done();
    });
  });

  it('PATCH /api/v1/users/:id 400 - username too long', function (done) {
    const user = fixtures.user.entity('admin');
    user.username = chance.string({ length: 33, pool: pools.username });
    doRequest(agent, 'patch', '/api/v1/users/', authenticatedUser.id, token, user, 400, function(err, res) {
      expect(res.body.statusCode).to.eqls(400);
      expect(res.body.errors[0]).to.eqls('\'username\' length must be less than or equal to 32 characters long');
      done();
    });
  });

  it('PATCH /api/v1/users/:id 400 - bad email', function (done) {
    const user = fixtures.user.entity('admin');
    user.email = 'imnotanemail';
    doRequest(agent, 'patch', '/api/v1/users/', authenticatedUser.id, token, user, 400, function(err, res) {
      expect(res.body.statusCode).to.eqls(400);
      expect(res.body.errors[0]).to.eqls('\'email\' must be a valid email');
      done();
    });
  });

  it('PATCH /api/v1/users/:id 400 - password too long', function (done) {
    const user = fixtures.user.entity('admin', 'abcdefghijklmnopqrstuvwxyz');
    doRequest(agent, 'patch', '/api/v1/users/', authenticatedUser.id, token, user, 400, function(err, res) {
      expect(res.body.statusCode).to.eqls(400);
      expect(res.body.errors[0]).to.eqls('\'password\' length must be less than or equal to 16 characters long');
      done();
    });
  });

  it('PATCH /api/v1/users/:id 400 - password too short', function (done) {
    const user = fixtures.user.entity('admin', 'abc');
    doRequest(agent, 'patch', '/api/v1/users/', authenticatedUser.id, token, user, 400, function(err, res) {
      expect(res.body.statusCode).to.eqls(400);
      expect(res.body.errors[0]).to.eqls('\'password\' length must be at least 8 characters long');
      done();
    });
  });

  it('PATCH /api/v1/users/:id 403 - no bearer', function (done) {
    const user = fixtures.user.entity('admin');
    doRequest(agent, 'patch', '/api/v1/users/', authenticatedUser.id, null, user, 403, function(err, res) {
      expect(res.statusCode).to.eqls(403);
      done();
    });
  });

  it('PATCH /api/v1/users/:id 403 - permission denied', function (done) {
    const user = fixtures.user.entity('admin');
    doRequest(agent, 'patch', '/api/v1/users/', authenticatedUser.id, unauthorizedToken, user, 403, function(err, res) {
      expect(res.statusCode).to.eqls(403);
      done();
    });
  });

  it('PATCH /api/v1/users/:id 404 - user not found', function (done) {
    const user = fixtures.user.entity('admin');
    doRequest(agent, 'patch', '/api/v1/users/', 9999, token, user, 404, function(err, res) {
      expect(res.statusCode).to.eqls(404);
      done();
    });
  });

  it('PATCH /api/v1/users/:id 404 - user not found because userId is not a number', function (done) {
    const user = fixtures.user.entity('admin');
    doRequest(agent, 'patch', '/api/v1/users/a', null, token, user, 404, function(err, res) {
      expect(res.statusCode).to.eqls(404);
      done();
    });
  });

  it('PATCH /api/v1/users/:id 200 - data ok', function (done) {
    const user = fixtures.user.entity('admin');
    doRequest(agent, 'patch', '/api/v1/users/', authenticatedUser.id, token, user, 200, function(err, res) {
      expect(res.statusCode).to.eqls(200);
      dataOk(res, 'user', 'update');
      done();
    });
  });

  it('DELETE /api/v1/users/:id 403 - no bearer', function (done) {
    request(server)
      .delete('/api/v1/users/1')
      .set('Accept', process.env.CONTENT_TYPE)
      .set('Origin', process.env.ORIGIN)
      .set('Content-Type', process.env.CONTENT_TYPE)
      .expect(403, done);
  });

  it('DELETE /api/v1/users/:id 403 - permission denied', function (done) {
    request(server)
      .delete('/api/v1/users/1')
      .set('Accept', process.env.CONTENT_TYPE)
      .set('Origin', process.env.ORIGIN)
      .set('Content-Type', process.env.CONTENT_TYPE)
      .set('Authorization', 'Bearer ' + unauthorizedToken)
      .expect(403, done);
  });

  it('DELETE /api/v1/users/:id 404 - user not found', function (done) {
    agent
      .delete('/api/v1/users/9999')
      .set('Accept', process.env.CONTENT_TYPE)
      .set('Origin', process.env.ORIGIN)
      .set('Content-Type', process.env.CONTENT_TYPE)
      .set('Authorization', 'Bearer ' + token)
      .expect(404, done);
  });

  it('DELETE /api/v1/users/:id 417 - userId is not a number', function (done) {
    agent
      .delete('/api/v1/users/a')
      .set('Accept', process.env.CONTENT_TYPE)
      .set('Origin', process.env.ORIGIN)
      .set('Content-Type', process.env.CONTENT_TYPE)
      .set('Authorization', 'Bearer ' + token)
      .expect(417, done);
  });

  it('DELETE /api/v1/users/:id 204', function (done) {
    agent
      .delete('/api/v1/users/' + authenticatedUser.id)
      .set('Accept', process.env.CONTENT_TYPE)
      .set('Origin', process.env.ORIGIN)
      .set('Content-Type', process.env.CONTENT_TYPE)
      .set('Authorization', 'Bearer ' + token)
      .expect(204, done);
  });

});