const expect = require('chai').expect;
const sinon = require('sinon');

const { CacheConfiguration } = require(process.cwd() + '/dist/api/config/cache.config');
const { CacheService } = require(process.cwd() + '/dist/api/services/cache.service');
const { Cache } = require(process.cwd() + '/dist/api/middlewares/cache.middleware');

describe('Middlewares', () => {

  describe('Cache', () => {

    const res = {
      status: (code) => {},
      json: (data) => {}
    };

    let stubEngine, stubIsActive, stubResJSON;

    beforeEach( () => {
      stubEngine = sinon.stub(CacheService.engine, 'get');
      stubResJSON = sinon.stub(res, 'json');
      stubIsActive = sinon.stub(CacheConfiguration.options, 'IS_ACTIVE');
    });

    afterEach( () => {
      stubEngine.restore();
      stubResJSON.restore();
      stubIsActive.restore();
    });

    it('should next when not activated', async () => {
      stubIsActive.value(false);
      stubEngine.callsFake((key) => {});
      await Cache.read({method: 'GET'}, {}, () => {});
      expect(stubEngine.called).to.be.false;
    });

    
    it('should next when method is not GET', async () => {
      stubIsActive.value(true)
      stubEngine.callsFake((key) => {});
      await Cache.read({method: 'POST'}, {}, () => {});
      expect(stubEngine.called).to.be.false;
    });

    it('should try to retrieve cached data', async () => {
      stubIsActive.value(true)
      stubEngine.callsFake((key) => {});
      await Cache.read({method: 'GET'}, {}, () => {});
      expect(stubEngine.called).to.be.true;
    });

    it('should output the cached data', async () => {
      stubIsActive.value(true)
      stubEngine.callsFake((key) => { 
        return { body: 'Hello World' }; 
      });
      stubResJSON.callsFake((data) => {});
      await Cache.read({method: 'GET'}, res, () => {});
      expect(stubEngine.called).to.be.true;
      expect(stubResJSON.called).to.be.true;
    });

    it('should next if not available cached data', async () => {
      stubIsActive.value(true)
      stubEngine.callsFake((key) => null);
      stubResJSON.callsFake((data) => {});
      await Cache.read({method: 'GET'}, res, () => {});
      expect(stubEngine.called).to.be.true;
      expect(stubResJSON.called).to.be.false;
    });

  });

});