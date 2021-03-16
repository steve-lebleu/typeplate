const { ErrorFactory } = require(process.cwd() + '/dist/api/factories/error.factory');
const { ServerError } = require(process.cwd() + '/dist/api/types/errors/server.error');

const expect = require('chai').expect;

describe('Factories', () => {

  describe('ErrorFactory', () => {

    it('should get Server Error', () => {
      expect(ErrorFactory.get(new Error('bad'))).to.be.instanceOf(ServerError);
    });
  
  });

});