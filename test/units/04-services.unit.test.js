const expect = require('chai').expect;
const sinon = require('sinon');
const { clone } = require('lodash');

const fs = require('fs');

const Jimp = require('jimp');

const fixtures = require(process.cwd() + '/test/utils/fixtures');

const { User } = require(process.cwd() + '/dist/api/core/models/user.model');

const { SanitizeService } = require(process.cwd() + '/dist/api/core/services/sanitizer.service');
const { AuthService } = require(process.cwd() + '/dist/api/core/services/auth.service');
const { MediaService} = require(process.cwd() + '/dist/api/core/services/media.service');
const { CacheService } = require(process.cwd() + '/dist/api/core/services/cache.service');
const { Logger } = require(process.cwd() + '/dist/api/core/services/logger.service');
const { CacheConfiguration } = require(process.cwd() + '/dist/api/config/cache.config');
const { UPLOAD } = require(process.cwd() + '/dist/api/config/environment.config');

describe('Services', () => {

  describe('AuthService', () => {

    describe('generateTokenResponse()', () => {

      it('should returns error when user is not passed', async () => {
        const token = fixtures.token.accessToken;
        const result = await AuthService.generateTokenResponse({}, token,  null);
        expect(result).is.instanceOf(Error);
      });
  
      it('should returns error when user is corrupted', async () => {
        const token = fixtures.token.accessToken;
        const user = new User();
        const result = await AuthService.generateTokenResponse(user, token,  null);
        expect(result).is.instanceOf(Error);
      });

      it('should returns error when access token not provided', async () => {
        const user = new User( fixtures.user.entity('user', '13245678') );
        user.id = 1;
        const result = await AuthService.generateTokenResponse(user, null,  null);
        expect(result).is.instanceOf(Error);
      });

      it('should be ok and returns well formed token', async () => {
        const token = fixtures.token.accessToken;
        const user = new User( fixtures.user.entity('user', '13245678') );
        user.id = 1;
        const result = await AuthService.generateTokenResponse(user, token,  null);
        expect(result).to.haveOwnProperty('tokenType');
        expect(result.tokenType).to.be.eqls('Bearer');
        expect(result).to.haveOwnProperty('accessToken');
        expect(result.accessToken).to.be.eqls(token);
        expect(result).to.haveOwnProperty('refreshToken');
        expect(result.refreshToken).to.be.a.string;
        expect(result.refreshToken.split('.')[0]).to.be.eqls(user.id.toString());
        expect(result).to.haveOwnProperty('expiresIn');
      });

    });

    describe('oAuth()', () => {

      it('should next with error if data cannot be retrieved from provider', async () => {
        await AuthService.oAuth('', '',  null, (error, user) => {
          expect(error).is.instanceOf(Error);
          expect(user).to.be.false;
        });
      });

      it('should next with error if verified email is not true', async () => {
        const profile = clone(fixtures.token.oauthFacebook);
        profile.username = 'yoda';
        profile.emails = [ { value: 'yoda@starwars.com', verified: false } ];
        await AuthService.oAuth('', '', profile, (error, user) => { 
          expect(error).is.instanceOf(Error);
          expect(user).to.be.false;
        });
      });

      it('should use provided data', async () => {
        const profile = clone(fixtures.token.oauthFacebook);
        profile.username = 'yoda';
        profile.emails = [ { value: 'yoda@starwars.com' } ];
        await AuthService.oAuth('', '', profile, (error, user) => { 
          if (error) throw error;
          expect(user.username).to.be.eqls('yoda');
          expect(user.email).to.be.eqls('yoda@starwars.com');
        });
      });

      it('should improve profile with default data', async () => {
        const profile = clone(fixtures.token.oauthFacebook);
        profile.username = undefined;
        profile.emails = undefined;
        await AuthService.oAuth('', '', profile, (error, user) => { 
          if (error) throw error;
          expect(user.email).to.includes('@externalprovider.com');
        });
      });

      it('should next with User instance', async () => {
        await AuthService.oAuth('', '', fixtures.token.oauthFacebook, (error, user) => { 
          if (error) throw error;
          expect(user).to.haveOwnProperty('id');
          expect(user).to.haveOwnProperty('username');
          expect(user).to.haveOwnProperty('email');
          expect(user).to.haveOwnProperty('role');
          expect(user).to.haveOwnProperty('password');
          expect(user).to.haveOwnProperty('apikey');   
        });
      });

    });

    describe('jwt()', () => {

      it('should next with error', async () =>  {
        await AuthService.jwt({ alter: 0 }, (error, result) => {
          expect(error).is.instanceOf(Error);
          expect(result).is.false;
        });
      });
  
      it('should next with false if user not found', async () => {
        await AuthService.jwt({ sub: 0 }, (error, result) => {
          expect(result).is.false;
        });
      });
  
      it('should next with User instance', async () => {
        await AuthService.jwt({ sub: 1 }, (error, result) => {
          expect(result).is.an('object');
        });
      });

    });

  });

  describe('CacheService', () => {

    describe('resolve', () => {

      it('should return memory cache instance', () => {
        const result = CacheService.engine;
        expect(result).to.be.an('object');
      });

    });

    describe('isActive', () => {

      it('should return memory cache enabled from env value', () => {
        expect(CacheService.isActive).to.be.eqls(CacheConfiguration.options.IS_ACTIVE);
      });

    });

    describe('duration', () => {

      it('should return memory cache duration from env value', () => {
        expect(CacheService.duration).to.be.eqls(CacheConfiguration.options.DURATION);
      });

    });

    describe('key()', () => {

      it('should return well formated key with crypted q params', () => {
        const req = {
          baseUrl: '/api/v1',
          path: '/medias/',
          query: { type: 'image' }
        };
        const result = CacheService.key(req);
        expect(result).to.includes('__mcache_/api/v1/medias/?q=');
        expect(result.split('q=')[1]).to.be.a('string')
      });

    });

    describe('refresh()', () => {

      it('should refresh current cache', () => {
        const stubIsActive = sinon.stub(CacheConfiguration.options, 'IS_ACTIVE').value(true);
        const req = {
          baseUrl: '/api/v1',
          path: '/medias/',
          query: { type: 'image' }
        };
        const key = CacheService.key(req);
        CacheService.engine.put(key, 'cached');
        expect(CacheService.engine.get(key)).to.be.eqls('cached');
        CacheService.refresh('medias');
        expect(CacheService.engine.get(key)).to.be.null;
        stubIsActive.restore();
      });

    });

    describe('put()', () => {

      it('should push a data into the cache', () => {
        const url = '/path-to-the-light/door/25';
        const key = CacheService.key( { url });
        const cached = CacheService.engine.put(key, { data: 'Yoda is into the game' } );
        expect(cached).to.be.an('object');
        expect(cached.data).to.be.eqls('Yoda is into the game');
      });

    });

    describe('get()', () => {

      it('should retrieve data from the cache', () => {
        const url = '/path-to-the-light/door/25';
        const key = CacheService.key( { url });
        const cached = CacheService.engine.get(key);
        expect(cached).to.be.an('object');
        expect(cached.data).to.be.eqls('Yoda is into the game');
      });

    });

  });

  describe('MediaService', () => {

    describe('rescale()', () => {

      it('should do nothing if not activated', (done) => {
        MediaService.OPTIONS.IS_ACTIVE = false;
        expect(MediaService.rescale({})).to.be.eqls(false);
        done();
      });

    });

    describe('remove()', () => {

      it('should remove all scaled images', (done) => {
        const image = fixtures.media.image({id:1});
        if (!fs.existsSync(`${UPLOAD.PATH}/images/master-copy/${image.fieldname}`)) { 
          fs.mkdirSync(`${UPLOAD.PATH}/images/master-copy/${image.fieldname}`) 
        }
        if (!fs.existsSync(`${UPLOAD.PATH}/images/rescale/${image.fieldname}`)) { 
          fs.mkdirSync(`${UPLOAD.PATH}/images/rescale/${image.fieldname}`);
          ['xs', 'sm', 'md', 'lg', 'xl'].forEach(size => {
            fs.mkdirSync(`${UPLOAD.PATH}/images/rescale/${image.fieldname}/${size}`);
          });
        }
        fs.copyFileSync(`${process.cwd()}/test/utils/fixtures/files/${image.filename}`, `${UPLOAD.PATH}/images/master-copy/${image.fieldname}/${image.filename}`);
        ['xs', 'sm', 'md', 'lg', 'xl'].forEach(size => {
          fs.copyFileSync(`${process.cwd()}/test/utils/fixtures/files/${image.filename}`, `${UPLOAD.PATH}/images/rescale/${image.fieldname}/${size}/${image.filename}`);
        });
        MediaService.remove(fixtures.media.image({id:1}));
        setTimeout(() => {
          expect(fs.existsSync(`${UPLOAD.PATH}/images/master-copy/${image.fieldname}/${image.filename}`)).to.be.false;
          ['xs', 'sm', 'md', 'lg', 'xl'].forEach(size => {
            expect(fs.existsSync(`${UPLOAD.PATH}/images/rescale/${image.fieldname}/${size}/${image.filename}`)).to.be.false;
          });
          done();
        }, 500)
      });


    });

  });

  describe('Sanitize', () => {
      
    describe('isSanitizable()', () => {

      it('should return false on primitive type', function(done) {
        const result = SanitizeService.isSanitizable('yoda');
        expect(result).to.be.false;
        done();
      });
      
      it('should return false on primitive type array', function(done) {
        const result = SanitizeService.isSanitizable(['yoda']);
        expect(result).to.be.false;
        done();
      });
    
      it('should return false on primitive object', function(done) {
        const result = SanitizeService.isSanitizable({ name: 'yoda' });
        expect(result).to.be.false;
        done();
      });
    
      it('should return false on mixed array', function(done) {
        const result = SanitizeService.isSanitizable([{ name: 'yoda'}, 'dark vador']);
        expect(result).to.be.false;
        done();
      });
    
      it('should return true on IModel instance', function(done) {
        const result = SanitizeService.isSanitizable( new User() );
        expect(result).to.be.true;
        done();
      });
    
      it('should return true on IModel instance array', function(done) {
        const result = SanitizeService.isSanitizable( [ new User(), new User() ] );
        expect(result).to.be.true;
        done();
      });

    });

    describe('sanitize()', () => {

      it('should return sanitized object', function(done) {
        const entity = function() {
          const self = {};
          self.id = 1;
          self.name = 'Yoda';
          self.password = '123456';
          self.whitelist =  ['id', 'name'];
          return self
        }
        const result = SanitizeService.sanitize(new entity());
        expect(result).to.haveOwnProperty('id');
        expect(result).to.haveOwnProperty('name');
        expect(result).to.not.haveOwnProperty('password');
        done();
      });

    });
  
  });

  describe('Logger', () => {

    describe('log()', () => {

      let sandbox;

      beforeEach(() => {
        sandbox = sinon.createSandbox();
      });

      afterEach(() => {
        sandbox.restore();
      });

      it('should call .info()', () => {
        sandbox.spy(Logger.engine, 'info');
        Logger.log('info', 'Test');
        expect(Logger.engine.info.calledOnce).to.be.true;
      });

      it('should call .error()', () => {
        sandbox.spy(Logger.engine, 'error');
        Logger.log('error', 'Test');
        expect(Logger.engine.error.calledOnce).to.be.true;
      });
        
    });

  });
});