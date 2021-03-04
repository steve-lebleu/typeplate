/* global describe,it,expect */
/* eslint-env node, mocha */

var { server } = require(process.cwd() + '/dist/api/app.bootstrap');

var request = require('supertest');
var fixtures = require('./fixtures');
var expect = require('chai').expect;
var { doRequest, doQueryRequest, doFormRequest, expectations, dataOk, pools } = require('./utils');

describe('Media routes', function () {
  
  var agent, password, credentials, token, unauthorizedToken, user, images, documents, archives;

  before(function (done) {

    agent       = request(server);
    password    = 'e2q2mak7';
    credentials = fixtures.user.entity('admin', password);

    doRequest(agent, 'post', '/api/v1/auth/register', null, null, credentials, 201, function(err, res) {
      expect(res.statusCode).to.eqls(201);
      token = res.body.token.accessToken;
      user = res.body.user;
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

  it('POST /api/v1/medias 400 - empty payload', function (done) {
    doFormRequest(agent, 'post', '/api/v1/medias/', null, token, {}, 400, function(err, res) {
      expect(res.statusCode).to.eqls(400);
      done();
    });
  });

  it('POST /api/v1/medias 400 - file too large', function (done) {
    doFormRequest(agent, 'post', '/api/v1/medias/', null, token, { name: 'document', path: process.cwd() + '/test/fixtures/files/Vue-Handbook.pdf' }, 400, function(err, res) {
      expect(res.statusCode).to.eqls(400);
      done();
    });
  });

  it('POST /api/v1/medias 400 - not supported mimetype', function (done) {
    doFormRequest(agent, 'post', '/api/v1/medias/', null, token, { name: 'audio', path: process.cwd() + '/test/fixtures/files/electric-bulb.mp4' }, 400, function(err, res) {
      expect(res.statusCode).to.eqls(400);
      done();
    });
  });

  it('POST /api/v1/medias 403 - no bearer', function (done) {
    doFormRequest(agent, 'post', '/api/v1/medias/', null, null, {}, 403, function(err, res) {
      expect(res.statusCode).to.eqls(403);
      done();
    });
  });

  it('POST /api/v1/medias 201 - image - file(s) exists + data ok', function (done) {
    doFormRequest(agent, 'post', '/api/v1/medias/', null, token, { name: 'image', path: process.cwd() + '/test/fixtures/files/javascript.jpg' }, 201, function(err, res) {
      expect(res.statusCode).to.eqls(201);
      expect(res.body).to.be.an('array');
      expect(res.body).satisfy(function(value) {
        return value.map( entry => dataOk( { body: entry }, 'media', 'create') );
      });
      images = res.body;
      done();
    });
  });

  it('POST /api/v1/medias 201 - document - file(s) exists + data ok', function (done) {
    doFormRequest(agent, 'post', '/api/v1/medias/', null, token, { name: 'document', path: process.cwd() + '/test/fixtures/files/Responsive_Webdesign.pdf' }, 201, function(err, res) {
      expect(res.statusCode).to.eqls(201);
      expect(res.body).to.be.an('array');
      expect(res.body).satisfy(function(value) {
        return value.map( entry => dataOk( { body: entry }, 'media', 'create') );
      });
      documents = res.body;
      done();
    });
  });

  it('POST /api/v1/medias 201 - archive - file(s) exists + data ok', function (done) {
    doFormRequest(agent, 'post', '/api/v1/medias/', null, token, { name: 'archive', path: process.cwd() + '/test/fixtures/files/Documents.rar' }, 201, function(err, res) {
      expect(res.statusCode).to.eqls(201);
      expect(res.body).to.be.an('array');
      expect(res.body).satisfy(function(value) {
        return value.map( entry => dataOk( { body: entry }, 'media', 'create') );
      });
      archives = res.body;
      done();
    });
  });

  it('GET /api/v1/medias/:id 400 - documentId is not a number', function (done) {
    doQueryRequest(agent, '/api/v1/medias/a', null, token, {}, 400, function(err, res) {
      expect(res.statusCode).to.eqls(400);
      done();
    });
  });

  it('GET /api/v1/medias/:id 403 - no bearer', function (done) {
    doQueryRequest(agent, '/api/v1/medias/', images[0].id, null, {}, 403, function(err, res) {
      expect(res.statusCode).to.eqls(403);
      done();
    });
  });

  it('GET /api/v1/medias/:id 403 - permission denied', function (done) {
    doQueryRequest(agent, '/api/v1/medias/', images[0].id, unauthorizedToken, {}, 403, function(err, res) {
      expect(res.statusCode).to.eqls(403);
      done();
    });
  });

  it('GET /api/v1/medias/:id 200 - data ok', function (done) {
    doQueryRequest(agent, '/api/v1/medias/', documents[0].id, token, {}, 200, function(err, res) {
      expect(res.statusCode).to.eqls(200);
      dataOk(res, 'media', 'read');
      done();
    });
  });

  it('GET /api/v1/medias 400 - malformed fieldname', function (done) {
    doQueryRequest(agent, '/api/v1/medias/', null, token, { fieldname: 'malformed123\?field name' }, 400, function(err, res) {
      expect(res.statusCode).to.eqls(400);
      done();
    });
  });

  it('GET /api/v1/medias 400 - malformed filename', function (done) {
    doQueryRequest(agent, '/api/v1/medias/', null, token, { filename: 'malformed\?file name' }, 400, function(err, res) {
      expect(res.statusCode).to.eqls(400);
      done();
    });
  });

  it('GET /api/v1/medias 400 - not supported mimetype', function (done) {
    doQueryRequest(agent, '/api/v1/medias/', null, token, { mimetype: 'application/unknown' }, 400, function(err, res) {
      expect(res.statusCode).to.eqls(400);
      done();
    });
  });

  it('GET /api/v1/medias 400 - owner is not an id', function (done) {
    doQueryRequest(agent, '/api/v1/medias/', null, token, { owner: 'toto' }, 400, function(err, res) {
      expect(res.statusCode).to.eqls(400);
      done();
    });
  });

  it('GET /api/v1/medias 403 - no bearer', function (done) {
    doQueryRequest(agent, '/api/v1/medias/', null, null, {}, 403, function(err, res) {
      expect(res.statusCode).to.eqls(403);
      done();
    });
  });

  it('GET /api/v1/medias 200 - pagination get 30 results by default', function (done) {
    doQueryRequest(agent, '/api/v1/medias/', null, token, {}, 200, function(err, res) {
      expect(res.statusCode).to.eqls(200);
      expect(res.body).length.lte(30);
      done();
    });
  });

  it('GET /api/v1/medias 200 - pagination get n results by query param', function (done) {
    doQueryRequest(agent, '/api/v1/medias/', null, token, { perPage: 50 }, 200, function(err, res) {
      expect(res.statusCode).to.eqls(200);
      expect(res.body).length.lte(50);
      done();
    });
  });

  it('GET /api/v1/medias 200 - results matches fieldname query param', function (done) {
    doQueryRequest(agent, '/api/v1/medias/', null, token, { fieldname: 'document' }, 200, function(err, res) {
      expect(res.statusCode).to.eqls(200);
      expect(res.body).satisfy(function(value) {
        return value.map( (entry) => { 
          expect(entry.fieldname).to.equals('document');
        })
      });
      done();
    });
  });

  it('GET /api/v1/medias 200 - results matches filename query param', function (done) {
    doQueryRequest(agent, '/api/v1/medias/', null, token, { filename: 'javascript' }, 200, function(err, res) {
      expect(res.statusCode).to.eqls(200);
      expect(res.body).satisfy(function(value) {
        return value.map( (entry) => { 
          expect(entry.filename).to.matches(/javascript/);
        })
      });
      done();
    });
  });

  it('GET /api/v1/medias 200 - results matches mimetype query param', function (done) {
    doQueryRequest(agent, '/api/v1/medias/', null, token, { mimetype: 'application/pdf' }, 200, function(err, res) {
      expect(res.statusCode).to.eqls(200);
      expect(res.body).satisfy(function(value) {
        return value.map( (entry) => { 
          expect(entry.mimetype).to.equals('application/pdf');
        })
      });
      done();
    });
  });

  it('GET /api/v1/medias 200 - results matches multiple query params', function (done) {
    doQueryRequest(agent, '/api/v1/medias/', null, token, { filename: 'Facture', mimetype: 'application/pdf' }, 200, function(err, res) {
      expect(res.statusCode).to.eqls(200);
      expect(res.body).satisfy(function(value) {
        return value.map( (entry) => { 
          expect(entry.filename).to.matches(/Facture/);
          expect(entry.mimetype).to.equals('application/pdf');
        })
      });
      done();
    });
  });

  it('GET /api/v1/medias 200 - data ok', function (done) {
    doQueryRequest(agent, '/api/v1/medias/', null, token, {}, 200, function(err, res) {
      expect(res.statusCode).to.eqls(200);
      expect(res.body).satisfy(function(value) {
        return Array.isArray(value) && value.length > 0;
      });
      expect(res.body).satisfy(function(value) {
        return value.map( (entry) => {
          dataOk({ body: entry }, 'media', 'read')
        })
      });
      done();
    });
  });

  it('PUT /api/v1/medias 400 - empty payload', function (done) {
    doFormRequest(agent, 'put', '/api/v1/medias/', documents[0].id, token, {}, 400, function(err, res) {
      expect(res.statusCode).to.eqls(400);
      done();
    });
  });

  it('PUT /api/v1/medias 400 - file too large', function (done) {
    doFormRequest(agent, 'put', '/api/v1/medias/', documents[0].id, token, { name: 'document', path: process.cwd() + '/test/fixtures/files/Vue-Handbook.pdf' }, 400, function(err, res) {
      expect(res.statusCode).to.eqls(400);
      done();
    });
  });

  it('PUT /api/v1/medias 400 - not supported mimetype', function (done) {
    doFormRequest(agent, 'put', '/api/v1/medias/', documents[0].id, token, { name: 'audio', path: process.cwd() + '/test/fixtures/files/electric-bulb.mp4' }, 400, function(err, res) {
      expect(res.statusCode).to.eqls(400);
      done();
    });
  });

  it('PUT /api/v1/medias 403 - no bearer', function (done) {
    doFormRequest(agent, 'put', '/api/v1/medias/', documents[0].id, null, {}, 403, function(err, res) {
      expect(res.statusCode).to.eqls(403);
      done();
    });
  });

  it('PUT /api/v1/medias 200 - file(s) exists + data ok', function (done) {
    doFormRequest(agent, 'put', '/api/v1/medias/', documents[0].id, token, { name: 'document', path: process.cwd() + '/test/fixtures/files/Documents.rar' }, 200, function(err, res) {
      expect(res.statusCode).to.eqls(200);
      dataOk( res, 'media', 'update')
      done();
    });
  });

  it('PATCH /api/v1/medias 400 - empty payload', function (done) {
    doFormRequest(agent, 'patch', '/api/v1/medias/', documents[0].id, token, {}, 400, function(err, res) {
      expect(res.statusCode).to.eqls(400);
      done();
    });
  });

  it('PATCH /api/v1/medias 400 - file too large', function (done) {
    doFormRequest(agent, 'patch', '/api/v1/medias/', documents[0].id, token, { name: 'document', path: process.cwd() + '/test/fixtures/files/Vue-Handbook.pdf' }, 400, function(err, res) {
      expect(res.statusCode).to.eqls(400);
      done();
    });
  });

  it('PATCH /api/v1/medias 400 - not supported mimetype', function (done) {
    doFormRequest(agent, 'patch', '/api/v1/medias/', documents[0].id, token, { name: 'audio', path: process.cwd() + '/test/fixtures/files/electric-bulb.mp4' }, 400, function(err, res) {
      expect(res.statusCode).to.eqls(400);
      done();
    });
  });

  it('PATCH /api/v1/medias 403 - no bearer', function (done) {
    doFormRequest(agent, 'patch', '/api/v1/medias/', documents[0].id, null, {}, 403, function(err, res) {
      expect(res.statusCode).to.eqls(403);
      done();
    });
  });

  it('PATCH /api/v1/medias 200 - file(s) exists + data ok', function (done) {
    doFormRequest(agent, 'patch', '/api/v1/medias/', documents[0].id, token, { name: 'document', path: process.cwd() + '/test/fixtures/files/Documents.rar' }, 200, function(err, res) {
      expect(res.statusCode).to.eqls(200);
      dataOk( res, 'media', 'update')
      done();
    });
  });

  it('DELETE /api/v1/medias/:id 400 - document is not a number', function (done) {
    agent
      .delete('/api/v1/medias/a')
      .set('Accept', process.env.CONTENT_TYPE)
      .set('Origin', process.env.ORIGIN)
      .set('Content-Type', process.env.CONTENT_TYPE)
      .set('Authorization', 'Bearer ' + token)
      .expect(400, done);
  });

  it('DELETE /api/v1/medias/:id 403 - no bearer', function (done) {
    agent
      .delete('/api/v1/medias/' + documents[0].id)
      .set('Origin', process.env.ORIGIN)
      .set('Content-Type', process.env.CONTENT_TYPE)
      .expect(403, done);
  });

  it('DELETE /api/v1/medias/:id 403 - permission denied', function (done) {
    agent
      .delete('/api/v1/medias/' + documents[0].id)
      .set('Origin', process.env.ORIGIN)
      .set('Content-Type', process.env.CONTENT_TYPE)
      .set('Authorization', 'Bearer ' + unauthorizedToken)
      .expect(403, done);
  });

  it('DELETE /api/v1/medias/:id 404 - document not found', function (done) {
    agent
      .delete('/api/v1/medias/' + 9999)
      .set('Accept', process.env.CONTENT_TYPE)
      .set('Origin', process.env.ORIGIN)
      .set('Content-Type', process.env.CONTENT_TYPE)
      .set('Authorization', 'Bearer ' + token)
      .expect(404, done);
  });

  it('DELETE /api/v1/medias/:id 204', function (done) {
    agent
      .delete('/api/v1/medias/' + documents[0].id)
      .set('Authorization', 'Bearer ' + token)
      .set('Origin', process.env.ORIGIN)
      .set('Content-Type', process.env.CONTENT_TYPE)
      .expect(204, done);  
  });
});