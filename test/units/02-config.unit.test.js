const { PassportConfiguration } = require(process.cwd() + '/dist/api/config/passport.config');
const expect = require('chai').expect;

describe('Config', function () {

  describe('Passport', function() {

    it('jwt() next with false if user not found', function(done) {
      PassportConfiguration.jwt({ sub: 0 }, function(error, result) {
        expect(error).is.null;
        expect(result).is.false;
        done();
      });
    });

    it('jwt() next with error if error occurrs', function(done) {
      PassportConfiguration.jwt({ alter: 0 }, function(error, result) {
        expect(error).is.not.null;
        expect(result).is.false;
        done();
      });
    });

  });

});