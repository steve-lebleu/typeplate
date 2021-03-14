const expect = require('chai').expect;
const sinon = require('sinon');
const fs = require('fs');

const { clone } = require('lodash');

const { Environment } = require(process.cwd() + '/dist/api/config/environment.config');

const { TYPEORM } = require(process.cwd() + '/dist/api/config/environment.config');
const { Database } = require(process.cwd() + '/dist/api/config/database.config');

describe('Config', function () {

  describe('Environment', () => {

    it('Current runtime environment should be test', () => {
      const instance = new Environment();
      instance.loads(process.versions.node);
      expect(instance.environment).to.be.eqls('test');
    });

    it('Current base directory should be dist', () => {
      const instance = new Environment();
      instance.loads(process.versions.node);
      expect(instance.base).to.be.eqls('dist');
    });

    it('Environment should expose a validation rule for each env variable', () => {
      const instance = new Environment();
      expect(instance.keys.every(key => instance.rules[key])).to.be.true;
    });

    it('Environment.load() should exit if node version is too low', () => {
      const instance = new Environment();
      const stub = sinon.stub(instance, 'exit');
      stub.callsFake( (message) => {
        expect(message).to.be.eqls('The node version of the server is too low. Please consider at least v14.16.0.')
      })
      instance.loads('13.0.0');
      expect(stub.called).to.be.true;
      stub.restore();
    });

    it('Environment.load() should exit if .env file is not found', () => {
      const instance = new Environment();
      const stub_exit = sinon.stub(instance, 'exit');
      const stub_fs = sinon.stub(fs, 'existsSync');
      stub_exit.callsFake( (message) => {
        expect(message).includes('Environment file not found at');
      });
      stub_fs.callsFake(() => false);
      instance.loads(process.versions.node);
      expect(stub_exit.called).to.be.true;
      stub_exit.restore();
      stub_fs.restore();
    });

    it('Environment.extracts() should retrieve variables from process.env and assign it on .variables', () => {
      const instance = new Environment();
      instance.loads(process.versions.node);
      expect(instance.variables).to.be.undefined;
      instance.extracts(process.env);
      expect(instance.variables).to.be.an('object');
    });

    it('Environment.validates() should validates variables issued from process.env', () => {
      const instance = new Environment();
      instance.loads(process.versions.node).extracts(process.env).validates();
      expect(instance.variables).to.be.an('object');
    });

    it('Environment.validates() should set default value if not provided, without error', () => {
      const instance = new Environment();
      const env = clone(process.env);
      env.TYPEORM_NAME = undefined;
      instance.loads(process.versions.node).extracts(env).validates();
      expect(instance.variables.TYPEORM_NAME).to.be.eqls('default');
      expect(instance.errors.length).to.be.eqls(0);
    });

    it('Environment.validates() should populates error', () => {
      const instance = new Environment();
      const env = clone(process.env);
      env.FACEBOOK_CONSUMER_ID = 'sdf5/';
      instance.loads(process.versions.node).extracts(env).validates();
      expect(instance.errors.length).to.be.eqls(1);
    });

    describe('Environment.validates() should validate fields', () => {

      [
        'AUTHORIZED', 'JWT_SECRET', 'TYPEORM_DB', 'TYPEORM_HOST', 'TYPEORM_PORT', 'TYPEORM_TYPE', 'TYPEORM_USER'
      ].forEach( key => {

        it(`${key} is required`, (done) => {
          const instance = new Environment();
          const env = clone(process.env);
          env[key] = undefined;
          instance.loads(process.versions.node).extracts(env).validates();
          expect(instance.errors.length).to.be.eqls(1);
          expect(instance.errors.some(e => e.includes(key))).to.be.true;
          done();
        });

      });

      [
        'AUTHORIZED', 'CONTENT_TYPE', 'FACEBOOK_CONSUMER_ID', 'FACEBOOK_CONSUMER_SECRET', 'GITHUB_CONSUMER_ID', 'GITHUB_CONSUMER_SECRET',
        'GOOGLE_CONSUMER_ID', 'GOOGLE_CONSUMER_SECRET', 'JWT_EXPIRATION_MINUTES', 'JWT_SECRET', 'LINKEDIN_CONSUMER_ID', 'LINKEDIN_CONSUMER_SECRET', 'PORT',
        'REFRESH_TOKEN_DURATION', 'REFRESH_TOKEN_UNIT', 'SSL_CERT', 'SSL_KEY', 'TYPEORM_DB', 'TYPEORM_CACHE', 'TYPEORM_HOST', 'TYPEORM_CACHE_DURATION',
        'UPLOAD_MAX_FILE_SIZE', 'UPLOAD_MAX_FILES', 'UPLOAD_WILDCARDS'
      ].forEach( key => {

        it(`${key} should be well formed`, (done) => {
          const instance = new Environment();
          const env = clone(process.env);
          env[key] = 'yoda-';
          instance.loads(process.versions.node).extracts(env);
          instance.validates();
          expect(instance.errors.length).to.be.eqls(1);
          expect(instance.errors.some(e => e.includes(key))).to.be.true;
          done();
        });

      })
       
    })
  
  });

  describe('Typeorm', () => {

    it('Database.connect() should failed', async () => {  
      const options = clone(TYPEORM);
      options.TYPE = 'yoda';
      options.NAME = 'yoda';
      await Database.connect(options).catch(e => {
        expect(e).to.be.instanceOf(Error);
        expect(e.name).to.be.eqls('MissingDriverError');
      });
    })
    
  });

});