const expect = require('chai').expect;

const { User } = require(process.cwd() + '/dist/api/models/user.model');
const { isSanitizable, sanitize } = require(process.cwd() + '/dist/api/services/sanitizer.service');

describe('Services', () => {

  describe('Sanitize', () => {
      
    it('isSanitizable() should return false on primitive type', function(done) {
      const result = isSanitizable('yoda');
      expect(result).to.be.false;
      done();
    });
    
    it('isSanitizable() should return false on primitive type array', function(done) {
      const result = isSanitizable(['yoda']);
      expect(result).to.be.false;
      done();
    });
  
    it('isSanitizable() should return false on primitive object', function(done) {
      const result = isSanitizable({ name: 'yoda' });
      expect(result).to.be.false;
      done();
    });
  
    it('isSanitizable() should return false on mixed array', function(done) {
      const result = isSanitizable([{ name: 'yoda'}, 'dark vador']);
      expect(result).to.be.false;
      done();
    });
  
    it('isSanitizable() should return true on IModel instance', function(done) {
      const result = isSanitizable( new User() );
      expect(result).to.be.true;
      done();
    });
  
    it('isSanitizable() should return true on IModel instance array', function(done) {
      const result = isSanitizable( [ new User(), new User() ] );
      expect(result).to.be.true;
      done();
    });

    it('sanitize() should return sanitized object', function(done) {
      const entity = function() {
        const self = {};
        self.id = 1;
        self.name = 'Yoda';
        self.password = '123456';
        self.whitelist =  ['id', 'name'];
        return self
      }
      const result = sanitize(new entity());
      expect(result).to.haveOwnProperty('id');
      expect(result).to.haveOwnProperty('name');
      expect(result).to.not.haveOwnProperty('password');
      done();
    });
  
  });

});