const { MySQLError } = require(process.cwd() + '/dist/api/core/types/errors/mysql.error');

const expect = require('chai').expect;

describe('Errors', () => {

  describe('MySQLError', () => {

    [
      { errno: 1052, status: 409 },
      { errno: 1054, status: 409 },
      { errno: 1062, status: 409 },
      { errno: 1452, status: 409 },
      { errno: 1364, status: 422 },
      { errno: 1406, status: 422 },
      { errno: 007, status: 422 }
    ].forEach(err => {

      it(`should get ${err.status} status`, () => {
        expect(new MySQLError(err).statusCode).to.be.eqls(err.status);
      });

    });

  });

});