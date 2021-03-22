const { ErrorFactory } = require(process.cwd() + '/dist/api/core/factories/error.factory');
const { ServerError } = require(process.cwd() + '/dist/api/core/types/errors/server.error');

const expect = require('chai').expect;

describe('Factories', () => {

  describe('ErrorFactory', () => {

    it('should get Server Error', () => {
      expect(ErrorFactory.get(new Error('bad'))).to.be.instanceOf(ServerError);
    });

    it('should get badImplementation Error', () => {
      const customError = function(message) {
        this.message = message;
      };

      customError.prototype.name = 'CustomError';

      const error = ErrorFactory.get(new customError('message'));

      expect(error.statusCode).to.be.eqls(500);
      expect(error.statusText).to.be.eqls('Internal Server Error');
    });

  });

});