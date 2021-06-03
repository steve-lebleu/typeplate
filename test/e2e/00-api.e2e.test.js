process.env.NODE_ENV = 'test';
process.env.ENVIRONMENT = 'test';
process.env.ORIGIN = 'http://localhost:4200';
process.env.CONTENT_TYPE = 'application/json';

// --- API server

var { server } = require(process.cwd() + '/dist/api/app.bootstrap');

describe('E2E API tests', () => {
  
  after(function () {
    server.close();
    server = undefined;
    delete server;
  });


  require('./01-api-routes.e2e.test');
  require('./02-auth-routes.e2e.test');
  require('./03-user-routes.e2e.test');
  require('./04-media-routes.e2e.test');

});