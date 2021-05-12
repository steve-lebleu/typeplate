// --- Test modules

const request = require('supertest');

const { expect } = require('chai');

// --- API server

let { server } = require(process.cwd() + '/dist/api/app.bootstrap');

// --- Test utils

const { user } = require(process.cwd() + '/test/utils/fixtures');
const { doRequest, doQueryRequest, doFormRequest, dataOk } = require(process.cwd() + '/test/utils');

describe('Media routes', function () {
  
  let agent, _adminToken, _unauthorizedToken, _archive, _audio, _document, _image, _video;

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

  describe('POST /api/v1/medias ', () => {

    it('400 - empty payload', function (done) {
      doFormRequest(agent, 'post', '/api/v1/medias/', null, _adminToken, {}, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });
  
    it('400 - file too large', function (done) {
      doFormRequest(agent, 'post', '/api/v1/medias/', null, _adminToken, { name: 'invoice', path: process.cwd() + '/test/utils/fixtures/files/Vue-Handbook.pdf' }, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });
  
    it('400 - not supported mimetype', function (done) {
      doFormRequest(agent, 'post', '/api/v1/medias/', null, _adminToken, { name: 'avatar', path: process.cwd() + '/test/utils/fixtures/files/tags.tif' }, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });
    
    it('400 - not supported fieldname', function (done) {
      doFormRequest(agent, 'post', '/api/v1/medias/', null, _adminToken, { name: 'yoda', path: process.cwd() + '/test/utils/fixtures/files/tags.tif' }, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('403 - no bearer', function (done) {
      doFormRequest(agent, 'post', '/api/v1/medias/', null, null, {}, function(err, res) {
        expect(res.statusCode).to.eqls(403);
        done();
      });
    });
  
    it('201 - audio - file(s) exists + data ok', function (done) {
      doFormRequest(agent, 'post', '/api/v1/medias/', null, _adminToken, { name: 'song', path: process.cwd() + '/test/utils/fixtures/files/kill-bill-vol-1-the-whistle-song.mp3' }, function(err, res) {
        expect(res.statusCode).to.eqls(201);
        expect(res.body).to.be.an('array');
        expect(res.body).satisfy(function(value) {
          return value.map( entry => dataOk( { body: entry }, 'media', 'create') );
        });
        _audio = res.body.shift();
        done();
      });
    });
  
    it('201 - archive - file(s) exists + data ok', function (done) {
      doFormRequest(agent, 'post', '/api/v1/medias/', null, _adminToken, { name: 'back-up', path: process.cwd() + '/test/utils/fixtures/files/documents.rar' }, function(err, res) {
        expect(res.statusCode).to.eqls(201);
        expect(res.body).to.be.an('array');
        expect(res.body).satisfy(function(value) {
          return value.map( entry => dataOk( { body: entry }, 'media', 'create') );
        });
        _archive = res.body.shift();
        done();
      });
    });
  
    it('201 - document - file(s) exists + data ok', function (done) {
      doFormRequest(agent, 'post', '/api/v1/medias/', null, _adminToken, { name: 'invoice', path: process.cwd() + '/test/utils/fixtures/files/Responsive_Webdesign.pdf' }, function(err, res) {
        expect(res.statusCode).to.eqls(201);
        expect(res.body).to.be.an('array');
        expect(res.body).satisfy(function(value) {
          return value.map( entry => dataOk( { body: entry }, 'media', 'create') );
        });
        _document = res.body.shift();
        done();
      });
    });
  
    it('201 - image - file(s) exists + data ok', function (done) {
      doFormRequest(agent, 'post', '/api/v1/medias/', null, _adminToken, { name: 'avatar', path: process.cwd() + '/test/utils/fixtures/files/javascript.jpg' }, function(err, res) {
        expect(res.statusCode).to.eqls(201);
        expect(res.body).to.be.an('array');
        expect(res.body).satisfy(function(value) {
          return value.map( entry => dataOk( { body: entry }, 'media', 'create') );
        });
        _image = res.body.shift();
        done();
      });
    });
  
    it('201 - video - file(s) exists + data ok', function (done) {
      doFormRequest(agent, 'post', '/api/v1/medias/', null, _adminToken, { name: 'teaser', path: process.cwd() + '/test/utils/fixtures/files/electric-bulb-2.mp4' }, function(err, res) {
        expect(res.statusCode).to.eqls(201);
        expect(res.body).to.be.an('array');
        expect(res.body).satisfy(function(value) {
          return value.map( entry => dataOk( { body: entry }, 'media', 'create') );
        });
        _video = res.body.shift();
        done();
      });
    });

  });

  describe('GET /api/v1/medias ', () => {

    it('400 - malformed fieldname', function (done) {
      doQueryRequest(agent, '/api/v1/medias/', null, _adminToken, { fieldname: 'malformed123\?field name' }, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });
  
    it('400 - malformed filename', function (done) {
      doQueryRequest(agent, '/api/v1/medias/', null, _adminToken, { filename: 'malformed\?file name' }, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });
  
    it('400 - not supported mimetype', function (done) {
      doQueryRequest(agent, '/api/v1/medias/', null, _adminToken, { mimetype: 'application/unknown' }, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });
  
    it('400 - not supported type', function (done) {
      doQueryRequest(agent, '/api/v1/medias/', null, _adminToken, { type: 'yoda' }, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });
  
    it('400 - owner is not an id', function (done) {
      doQueryRequest(agent, '/api/v1/medias/', null, _adminToken, { owner: 'toto' }, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });
  
    it('403 - no bearer', function (done) {
      doQueryRequest(agent, '/api/v1/medias/', null, null, {}, function(err, res) {
        expect(res.statusCode).to.eqls(403);
        done();
      });
    });
  
    it('200 - pagination get 30 results by default', function (done) {
      doQueryRequest(agent, '/api/v1/medias/', null, _adminToken, {}, function(err, res) {
        expect(res.statusCode).to.eqls(200);
        expect(res.body.data).length.lte(30);
        done();
      });
    });
  
    it('200 - pagination get n results by query param', function (done) {
      doQueryRequest(agent, '/api/v1/medias/', null, _adminToken, { perPage: 50 }, function(err, res) {
        expect(res.statusCode).to.eqls(200);
        expect(res.body.data).length.lte(50);
        done();
      });
    });
  
    it('200 - results matches fieldname query param', function (done) {
      doQueryRequest(agent, '/api/v1/medias/', null, _adminToken, { fieldname: 'invoice' }, function(err, res) {
        expect(res.statusCode).to.eqls(200);
        expect(res.body.data).satisfy(function(value) {
          return value.map( (entry) => { 
            expect(entry.fieldname).to.equals('invoice');
          })
        });
        done();
      });
    });
  
    it('200 - results matches filename query param', function (done) {
      doQueryRequest(agent, '/api/v1/medias/', null, _adminToken, { filename: 'javascript' }, function(err, res) {
        expect(res.statusCode).to.eqls(200);
        expect(res.body.data).satisfy(function(value) {
          return value.map( (entry) => { 
            expect(entry.filename).to.matches(/javascript/);
          })
        });
        done();
      });
    });
  
    it('200 - results matches mimetype query param', function (done) {
      doQueryRequest(agent, '/api/v1/medias/', null, _adminToken, { mimetype: 'application/pdf' }, function(err, res) {
        expect(res.statusCode).to.eqls(200);
        expect(res.body.data).satisfy(function(value) {
          return value.map( (entry) => { 
            expect(entry.mimetype).to.equals('application/pdf');
          })
        });
        done();
      });
    });
  
    
    it('200 - results matches type query param', function (done) {
      doQueryRequest(agent, '/api/v1/medias/', null, _adminToken, { type: 'image' }, function(err, res) {
        expect(res.statusCode).to.eqls(200);
        expect(res.body.data).satisfy(function(value) {
          return value.map( (entry) => { 
            expect(['image/bmp' , 'image/gif' , 'image/jpg' , 'image/jpeg' , 'image/png'].includes(entry.mimetype)).to.be.true;
          })
        });
        done();
      });
    });
  
    it('200 - results matches size query param', function (done) {
      doQueryRequest(agent, '/api/v1/medias/', null, _adminToken, { size: 30000 }, function(err, res) {
        expect(res.statusCode).to.eqls(200);
        expect(res.body.data).satisfy(function(value) {
          return value.map( (entry) => { 
            expect(entry.size).to.be.gte(3000);
          })
        });
        done();
      });
    });
  
    it('200 - results matches multiple query params', function (done) {
      doQueryRequest(agent, '/api/v1/medias/', null, _adminToken, { filename: 'Facture', mimetype: 'application/pdf' }, function(err, res) {
        expect(res.statusCode).to.eqls(200);
        expect(res.body.data).satisfy(function(value) {
          return value.map( (entry) => { 
            expect(entry.filename).to.matches(/Facture/);
            expect(entry.mimetype).to.equals('application/pdf');
          })
        });
        done();
      });
    });
  
    it('200 - data ok', function (done) {
      doQueryRequest(agent, '/api/v1/medias/', null, _adminToken, {}, function(err, res) {
        expect(res.statusCode).to.eqls(200);
        expect(res.body.data).satisfy(function(value) {
          return Array.isArray(value) && value.length > 0;
        });
        expect(res.body.data).satisfy(function(value) {
          return value.map( (entry) => {
            dataOk({ body: entry }, 'media', 'read')
          })
        });
        done();
      });
    });
    
  });

  describe('GET /api/v1/medias/:id ', () => {

    it('400 - media id is not a number', function (done) {
      doQueryRequest(agent, '/api/v1/medias/a', null, _adminToken, {}, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });
  
    it('403 - no bearer', function (done) {
      doQueryRequest(agent, '/api/v1/medias/', _image.id, null, {}, function(err, res) {
        expect(res.statusCode).to.eqls(403);
        done();
      });
    });
  
    it.skip('403 - permission denied', function (done) {
      doQueryRequest(agent, '/api/v1/medias/', _image.id, _unauthorizedToken, {}, function(err, res) {
        expect(res.statusCode).to.eqls(403);
        done();
      });
    });
  
    it('200 - data ok', function (done) {
      doQueryRequest(agent, '/api/v1/medias/', _image.id, _adminToken, {},  function(err, res) {
        expect(res.statusCode).to.eqls(200);
        dataOk(res, 'media', 'read');
        done();
      });
    });

  });

  describe('PUT /api/v1/medias:id', () => {

    it('400 - empty payload', function (done) {
      doFormRequest(agent, 'put', '/api/v1/medias/', _document.id, _adminToken, {}, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });
  
    it('400 - file too large', function (done) {
      doFormRequest(agent, 'put', '/api/v1/medias/', _document.id, _adminToken, { name: 'invoice', path: process.cwd() + '/test/utils/fixtures/files/Vue-Handbook.pdf' }, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });
  
    it('400 - not supported mimetype', function (done) {
      doFormRequest(agent, 'put', '/api/v1/medias/', _document.id, _adminToken, { name: 'avatar', path: process.cwd() + '/test/utils/fixtures/files/tags.tif' }, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });
    
    it('400 - not supported fieldname', function (done) {
      doFormRequest(agent, 'put', '/api/v1/medias/', _document.id, _adminToken, { name: 'yoda', path: process.cwd() + '/test/utils/fixtures/files/electric-bulb.mp4' }, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('403 - no bearer', function (done) {
      doFormRequest(agent, 'put', '/api/v1/medias/', _document.id, null, {}, function(err, res) {
        expect(res.statusCode).to.eqls(403);
        done();
      });
    });
  
    it('200 - file(s) exists + data ok', function (done) {
      doFormRequest(agent, 'put', '/api/v1/medias/', _document.id, _adminToken, { name: 'back-up', path: process.cwd() + '/test/utils/fixtures/files/documents.rar' },function(err, res) {
        expect(res.statusCode).to.eqls(200);
        dataOk( res, 'media', 'update')
        done();
      });
    });

  });

  describe('PATCH /api/v1/medias:id', () => {

    it('400 - empty payload', function (done) {
      doFormRequest(agent, 'patch', '/api/v1/medias/', _document.id, _adminToken, {}, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });
  
    it('400 - file too large', function (done) {
      doFormRequest(agent, 'patch', '/api/v1/medias/', _document.id, _adminToken, { name: 'invoice', path: process.cwd() + '/test/utils/fixtures/files/Vue-Handbook.pdf' },function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });
  
    it('400 - not supported mimetype', function (done) {
      doFormRequest(agent, 'patch', '/api/v1/medias/', _document.id, _adminToken, { name: 'avatar', path: process.cwd() + '/test/utils/fixtures/files/tags.tif' }, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });
  
    it('400 - not supported fieldname', function (done) {
      doFormRequest(agent, 'patch', '/api/v1/medias/', _document.id, _adminToken, { name: 'yoda', path: process.cwd() + '/test/utils/fixtures/files/electric-bulb.mp4' }, function(err, res) {
        expect(res.statusCode).to.eqls(400);
        done();
      });
    });

    it('403 - no bearer', function (done) {
      doFormRequest(agent, 'patch', '/api/v1/medias/', _document.id, null, {}, function(err, res) {
        expect(res.statusCode).to.eqls(403);
        done();
      });
    });
  
    it('200 - file(s) exists + data ok', function (done) {
      doFormRequest(agent, 'patch', '/api/v1/medias/', _document.id, _adminToken, { name: 'back-up', path: process.cwd() + '/test/utils/fixtures/files/documents.rar' }, function(err, res) {
        expect(res.statusCode).to.eqls(200);
        dataOk( res, 'media', 'update')
        done();
      });
    });

  });

  describe('DELETE /api/v1/medias/:id ', () => {

    it('400 - document is not a number', function (done) {
      agent
        .delete('/api/v1/medias/a')
        .set('Accept', process.env.CONTENT_TYPE)
        .set('Origin', process.env.ORIGIN)
        .set('Content-Type', process.env.CONTENT_TYPE)
        .set('Authorization', 'Bearer ' + _adminToken)
        .expect(400, done);
    });
  
    it('403 - no bearer', function (done) {
      agent
        .delete('/api/v1/medias/' + _document.id)
        .set('Origin', process.env.ORIGIN)
        .set('Content-Type', process.env.CONTENT_TYPE)
        .expect(403, done);
    });
  
    it.skip('403 - permission denied', function (done) {
      agent
        .delete('/api/v1/medias/' + _document.id)
        .set('Origin', process.env.ORIGIN)
        .set('Content-Type', process.env.CONTENT_TYPE)
        .set('Authorization', 'Bearer ' + _unauthorizedToken)
        .expect(403, done);
    });
  
    it('404 - document not found', function (done) {
      agent
        .delete('/api/v1/medias/' + 9999)
        .set('Accept', process.env.CONTENT_TYPE)
        .set('Origin', process.env.ORIGIN)
        .set('Content-Type', process.env.CONTENT_TYPE)
        .set('Authorization', 'Bearer ' + _adminToken)
        .expect(404, done);
    });
  
    it('204', function (done) {
      agent
        .delete('/api/v1/medias/' + _document.id)
        .set('Authorization', 'Bearer ' + _adminToken)
        .set('Origin', process.env.ORIGIN)
        .set('Content-Type', process.env.CONTENT_TYPE)
        .expect(204, done);  
    });

  });

});