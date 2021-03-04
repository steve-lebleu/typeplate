/* global describe,it,expect */
/* eslint-env node, mocha */

process.env.NODE_ENV = 'test';
process.env.ENVIRONMENT = 'test';
process.env.ORIGIN = 'http://localhost:4200';
process.env.RUNNER = 'travis';
process.env.CONTENT_TYPE = 'application/json';

var { server, application } = require(process.cwd() + '/dist/api/app.bootstrap');

const pkgInfo = require(process.cwd() +  '/package.json');
const expect = require('chai').expect;

describe('Express application', () => {

  before( () => {});

  after( () => {
    server.close();
    server = undefined;
    delete server;
  });

  it('Express instance type is function', () => {
    expect(typeof(application)).to.equal('function');
  });

  it('Express server version is 4.16.4', () => {
    expect(pkgInfo.dependencies.express.slice(1)).to.equal('4.16.4');
  });

});