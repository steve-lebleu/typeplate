const { application } = require(process.cwd() + '/dist/api/app.bootstrap');

const pkgInfo = require(process.cwd() +  '/package.json');
const expect = require('chai').expect;

describe('Express application', () => {

  it('Express instance type is function', () => {
    expect(typeof(application)).to.equal('function');
  });

  it('Express server version is 4.16.4', () => {
    expect(pkgInfo.dependencies.express).to.equal('4.16.4');
  });

});