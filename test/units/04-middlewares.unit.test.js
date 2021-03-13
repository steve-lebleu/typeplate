const expect = require('chai').expect;
const sinon = require('sinon');

const { Cache } = require(process.cwd() + '/dist/api/services/cache.service');
const { Kache } = require(process.cwd() + '/dist/api/middlewares/cache.middleware');

describe('Middlewares', () => {

  describe('Cache', () => {

    it('should next when not activated', async () => {
      Cache.options.IS_ACTIVE = false;
      const stub = sinon.stub(Cache.resolve, 'get');
      stub.callsFake((key) => {});
      Kache({method: 'GET'}, {}, () => {});
      expect(stub.called).to.be.false;
      stub.restore()
    });

    it('should next when method is not GET', async () => {
      Cache.options.IS_ACTIVE = true;
      const stub = sinon.stub(Cache.resolve, 'get');
      stub.callsFake((key) => {});
      Kache({method: 'POST'}, {}, () => {});
      expect(stub.called).to.be.false;
      stub.restore()
    });

    it('should try to retrieve cached data', async () => {
      Cache.options.IS_ACTIVE = true;
      const stub = sinon.stub(Cache.resolve, 'get');
      stub.callsFake((key) => {});
      Kache({method: 'GET'}, {}, () => {});
      expect(stub.called).to.be.true;
      stub.restore()
    });

    it('should output the cached data', async () => {
      const res = {
        status: (code) => {},
        json: (data) => {}
      };
      Cache.options.IS_ACTIVE = true;
      const stub = sinon.stub(Cache.resolve, 'get');
      const stub_res = sinon.stub(res, 'json');
      stub.callsFake((key) => { 
        return { body: 'Hello World' }; 
      });
      stub_res.callsFake((data) => {});
      Kache({method: 'GET'}, res, () => {});
      expect(stub.called).to.be.true;
      expect(stub_res.called).to.be.true;
      stub.restore();
      stub_res.restore();
    });

    it('should next if not available cached data', async () => {
      const res = {
        status: (code) => {},
        json: (data) => {}
      };
      Cache.options.IS_ACTIVE = true;
      const stub = sinon.stub(Cache.resolve, 'get');
      const stub_res = sinon.stub(res, 'json');
      stub.callsFake((key) => null);
      stub_res.callsFake((data) => {});
      Kache({method: 'GET'}, res, () => {});
      expect(stub.called).to.be.true;
      expect(stub_res.called).to.be.false;
      stub.restore();
      stub_res.restore();
    });

  });

});