process.env.NODE_ENV = 'test';
process.env.ENVIRONMENT = 'test';
process.env.ORIGIN = 'http://localhost:4200';
process.env.RUNNER = 'travis';

var { server, application } = require(process.cwd() + '/dist/api/app.bootstrap');

var pkgInfo = require(process.cwd() +  '/package.json');
var expect  = require("chai").expect;

describe("Express application", function () {
  
  before(function () {});
  
  after(function () {
    server.close();
    server = undefined;
    delete server;
  });

  it("Express instance type is function", function() {
    expect(typeof(application)).to.equal('function');
  });

  it("Express server version is 4.16.4", function() {
    expect(pkgInfo.dependencies.express.slice(1)).to.equal('4.16.4');
  });

});