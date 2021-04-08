let request = require('supertest');

let { server } = require(process.cwd() + '/dist/api/app.bootstrap');

describe('Routes resolving', () => {

  describe('/status', () => {

    it('200 - OK', (done) => {
      request(server)
        .get('/api/v1/status')
        .set('Content-Type', process.env.CONTENT_TYPE)
        .set('Origin', process.env.ORIGIN)
        .expect(200, done);
    });

  });

  describe('/report-violation', () => {

    it('204 - OK', (done) => {
      request(server)
        .post('/api/v1/report-violation')
        .set('Content-Type', process.env.CONTENT_TYPE)
        .set('Origin', process.env.ORIGIN)
        .send({ data: 'report-violation' })
        .expect(204, done);
    });

  });

  describe('/*', () => {

    it('404 - anything', (done) => {
      request(server)
        .get('/api/v1/foo/bar')
        .set('Content-Type', process.env.CONTENT_TYPE)
        .set('Accept', process.env.CONTENT_TYPE)
        .set('Origin', process.env.ORIGIN)
        .expect(404, done);
    });
  
    it('406 - content-type header not present', (done) => {
      request(server)
        .get('/api/v1/status')
        .set('Accept', process.env.CONTENT_TYPE)
        .set('Origin', process.env.ORIGIN)
        .expect(406, done);
    });
  
    it('406 - content-type header not allowed', (done) => {
      request(server)
        .get('/api/v1/status')
        .set('Accept', process.env.CONTENT_TYPE)
        .set('Origin', process.env.ORIGIN)
        .set('Content-Type', 'application/graphql')
        .expect(406, done);
    });
  
    it('406 - origin header not present', (done) => {
      request(server)
        .get('/api/v1/status')
        .set('Accept', process.env.CONTENT_TYPE)
        .set('Content-Type', process.env.CONTENT_TYPE)
        .expect(406, done);
    });
  
    it('406 - domain not allowed by CORS', function (done) {
      request(server)
        .get('/api/v1/status')
        .set('Accept', process.env.CONTENT_TYPE)
        .set('Content-Type', process.env.CONTENT_TYPE)
        .set('Origin', 'http://www.test.com')
        .expect(406, done);
    });
    
  });

});