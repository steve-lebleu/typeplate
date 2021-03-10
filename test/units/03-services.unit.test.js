const expect = require('chai').expect;
const sinon = require('sinon');
const Axios = require('axios');

const { User } = require(process.cwd() + '/dist/api/models/user.model');
const { isSanitizable, sanitize } = require(process.cwd() + '/dist/api/services/sanitizer.service');
const { AuthProvider } = require(process.cwd() + '/dist/api/services/auth-provider.service');
const { jwt } = require(process.cwd() + '/dist/api/services/auth.service');
const { Cache } = require(process.cwd() + '/dist/api/services/cache.service');

describe('Services', () => {

  describe('Auth provider', () => {

    it('AuthProvider.facebook() should return credentials from Facebook API', async () => {
      
      const stub = sinon.stub(Axios, 'get')

      stub.callsFake( async (url) => {
        return { data: { id: 1, name: 'Yoda', email: 'yoda@theforce.com', picture:  { data: { url: 'https://media.giphy.com/media/3o7abrH8o4HMgEAV9e/giphy.gif' } } } };
      })

      const result = await AuthProvider.facebook('my-token');

      expect(result.service).to.be.eqls('facebook');
      expect(result.id).to.be.eqls(1);
      expect(result.name).to.be.eqls('Yoda');
      expect(result.email).to.be.eqls('yoda@theforce.com');

      stub.restore();

    });

    it('AuthProvider.google() should return credentials from Google API', async () => {
      
      const stub = sinon.stub(Axios, 'get')

      stub.callsFake( async (url) => {
        return { data: { sub: 1, name: 'Yoda', email: 'yoda@theforce.com', picture: 'https://media.giphy.com/media/3o7abrH8o4HMgEAV9e/giphy.gif' } };
      })

      const result = await AuthProvider.google('my-token');

      expect(result.service).to.be.eqls('google');
      expect(result.id).to.be.eqls(1);
      expect(result.name).to.be.eqls('Yoda');
      expect(result.email).to.be.eqls('yoda@theforce.com');

      stub.restore();

    })
    
  });

  describe('Auth', function() {

    it('jwt() next with false if user not found', function(done) {
      jwt({ sub: 0 }, function(error, result) {
        expect(error).is.null;
        expect(result).is.false;
        done();
      });
    });

    it('jwt() next with error if error occurrs', function(done) {
      jwt({ alter: 0 }, function(error, result) {
        expect(error).is.not.null;
        expect(result).is.false;
        done();
      });
    });

    it('jwt() next with error if error occurrs', function(done) {
      jwt({ alter: 0 }, function(error, result) {
        expect(error).is.not.null;
        expect(result).is.false;
        done();
      });
    });
    
  });

  describe('Cache', () => {

    it('Cache.revolve should return memory cache instance', () => {
      const result = Cache.resolve;
      expect(result).to.be.an('object');
    });

    it('Cache.key() should return well formated key', () => {
      const url = '/path-to-the-light/door/25';
      const result = Cache.key( { url });
      expect(result).to.be.eqls(`__mcache_${url}`);
    });

    it('Cache.resolve.put() should push a data into the cache', () => {
      const url = '/path-to-the-light/door/25';
      const key = Cache.key( { url });
      const cached = Cache.resolve.put(key, { data: 'Yoda is into the game' } );
      expect(cached).to.be.an('object');
      expect(cached.data).to.be.eqls('Yoda is into the game');
    });

    it('Cache.resolve.get() should retrieve data from the cache', () => {
      const url = '/path-to-the-light/door/25';
      const key = Cache.key( { url });
      const cached = Cache.resolve.get(key);
      expect(cached).to.be.an('object');
      expect(cached.data).to.be.eqls('Yoda is into the game');
    });

  });

  describe('Media', () => {

  });

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