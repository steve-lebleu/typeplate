let { server } = require(process.cwd() + '/dist/api/app.bootstrap');

describe('Units tests', () => {

  before( () => {});

  after( () => {
    server.close();
    delete server;
  });

  require('./01-express-app.unit.test');
  require('./02-config.unit.test');
  require('./03-utils.unit.test');
  require('./04-services.unit.test');
  require('./05-middlewares.unit.test');
  require('./06-factories.unit.test');
  require('./07-errors.unit.test');

});