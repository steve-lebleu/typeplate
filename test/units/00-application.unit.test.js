var { server } = require(process.cwd() + '/dist/api/app.bootstrap');

describe('Units tests', () => {

  before( () => {});

  after( () => {
    server.close();
    server = undefined;
    delete server;
  });

  require('./01-express-app.unit.test');
  require('./02-config.unit.test');
  require('./02-utils.unit.test');
  require('./03-services.unit.test');

});