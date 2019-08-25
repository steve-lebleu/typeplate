var { server } = require(process.cwd() + '/dist/api/app.bootstrap');
var request = require('supertest');

describe("Routes resolving", function () {
  
  before(function () {});
  
  after(function () {
    server.close();
    server = undefined;
    delete server;
  });

  it('API status is OK 200', function (done) {
    request(server)
      .get('/api/v1/status')
      .set('Content-Type', process.env.CONTENT_TYPE)
      .set('Origin', process.env.ORIGIN)
      .expect(200, done);
  });

  it('API report violation is OK 200', function (done) {
    request(server)
      .post('/api/v1/report-violation')
      .set('Content-Type', process.env.CONTENT_TYPE)
      .set('Origin', process.env.ORIGIN)
      .send({ data: 'report-violation' })
      .expect(200, done);
  });
  
  it('404 on everything else', function (done) {
    request(server)
      .get('/api/v1/foo/bar')
      .set('Accept', process.env.CONTENT_TYPE)
      .set('Origin', process.env.ORIGIN)
      .set('Content-Type', process.env.CONTENT_TYPE)
      .expect(404, done);
  });

  it('Content-Type header not present rejected as Unacceptable 406', function (done) {
    request(server)
      .get('/api/v1/status')
      .set('Accept', process.env.CONTENT_TYPE)
      .set('Origin', process.env.ORIGIN)
      .expect(406, done);
  });

  it('Origin header not present rejected as Unacceptable 406', function (done) {
    request(server)
      .get('/api/v1/status')
      .set('Accept', process.env.CONTENT_TYPE)
      .set('Content-Type', process.env.CONTENT_TYPE)
      .expect(406, done);
  });

  it('Domain not allowed by CORS rejected as Unacceptable 406', function (done) {
    request(server)
      .get('/api/v1/status')
      .set('Accept', process.env.CONTENT_TYPE)
      .set('Content-Type', process.env.CONTENT_TYPE)
      .set('Origin', 'http://www.test.com')
      .expect(406, done);
  });

});