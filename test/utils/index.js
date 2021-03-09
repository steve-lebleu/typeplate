var { expect } = require('chai');
var { existsSync }= require('fs');

var Util = require('util');

const _exec = (agent, payload, options, done) => {
  _doRequest(agent, 'post', options.route, null, options.token, payload, options.code, function(err, res) {
    expect(res.statusCode).to.equals(options.code);
    done();
  });
};

const _doRequest = (agent, method, route, id, token, payload, status, callback) => {
  const path = id !== null ? `${route}${id}` : route;
  return agent[method](path)
    .set('Authorization', 'Bearer ' + token)
    .set('Accept', process.env.CONTENT_TYPE)
    .set('Content-Type', process.env.CONTENT_TYPE)
    .set('Origin', process.env.ORIGIN)
    .send(payload)
    .expect(status)
    .end(function(err, res) {
      callback(err, res);
    });
};

exports.pools = {
  password: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  username: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
};

exports.routes = {
  users: {},
  document: {}
};

exports.statusCodes = {
  "200": 200,
  "201": 201,
  "202": 202,
  "400": 400,
  "401": 401,
  "403": 403,
  "404": 404,
  "406": 406,
  "409": 409,
  "417": 417,
  "500": 500
};

exports.doRequest = _doRequest;

exports.doQueryRequest = (agent, route, id, token, payload, status, callback) => {
  const path = id !== null ? `${route}${id}` : route;
  return agent.get(path)
    .set('Authorization', 'Bearer ' + token)
    .set('Accept', process.env.CONTENT_TYPE)
    .set('Content-Type', process.env.CONTENT_TYPE)
    .set('Origin', process.env.ORIGIN)
    .query(payload)
    .expect(status)
    .end(function(err, res) {
      callback(err, res);
    });
};

exports.doFormRequest = (agent, method, route, id, token, payload, status, callback) => {
  const path = id !== null ? `${route}${id}` : route;
  return agent[method](path)
    .set('Authorization', 'Bearer ' + token)
    .set('Accept', process.env.CONTENT_TYPE)
    .set('Content-Type', 'multipart/form-data')
    .set('Origin', process.env.ORIGIN)
    .attach(payload.name, payload.path)
    .expect(status)
    .end(function(err, res) {
      callback(err, res);
    });
};

exports.expectations = (res, field, err) => {
  expect(res.body.statusCode).to.eqls(400);
  expect(res.body.errors).to.be.an('array').length.gt(0);
  expect(res.body.errors).satisfy(function(value) {
    return value.filter( error => error.field === field && error.types.includes(err)).length >= 1;
  });
};

exports.dataOk = (res, entity, method) => {
  const models = [
    {
      name: 'user',
      expect: () => {
        expect(res.body).to.have.all.keys('id', 'username', 'email', 'role', 'createdAt', 'updatedAt');
        expect(res.body.id).to.be.a('number');
        expect(res.body.username).to.be.a('string');
        expect(res.body.email).to.be.a('string');
        expect(res.body.email).to.match(/^[a-z-0-9\w\W\s]{2,}@[a-z]{2,}\.[a-z]{2,8}$/);
        expect(res.body.role).to.be.oneOf(['admin', 'user'])
        expect(res.body.createdAt).to.be.a('string');
        expect(res.body.createdAt).satisfy(function(value) {
          return Util.types.isDate(new Date(value));
        });
        if(method === 'update') {
          expect(res.body.updatedAt).satisfy(function(value) {
            return Util.types.isDate(new Date(value));
          });
        }
      }
    },
    {
      name: 'media',
      expect: () => {
        expect(res.body).to.have.all.keys(['id', 'fieldname', 'filename', 'path', 'mimetype', 'size', 'url', 'createdAt', 'updatedAt']);
        expect(res.body.id).to.be.a('number');
        expect(res.body.fieldname).to.be.a('string');
        expect(res.body.filename).to.be.a('string');
        expect(res.body.path).to.be.a('string');
        expect(existsSync(res.body.path)).to.eqls(true);
        expect(res.body.mimetype).to.be.a('string');
        expect(res.body.size).to.be.a('number');
        expect(res.body.createdAt).to.be.a('string');
        expect(res.body.createdAt).satisfy(function(value) {
          return Util.types.isDate(new Date(value));
        });
        if(method === 'update') {
          expect(res.body.updatedAt).satisfy(function(value) {
            return Util.types.isDate(new Date(value));
          });
        }  
      }
    }
  ];
  return models.filter( model => model.name === entity ).shift().expect();
}

exports.execOne = (name, agent, payload, options, done) => {
  const c = cases.filter( c => c.name === name ).slice().shift();
  _exec(agent, c.payload(payload), options, done);
};

exports.execMany = (agent, payload, options, names) => {
  cases.filter( c => names.includes[c.name] ).forEach( c => {
    it(c.description(options), function(done) {
      _exec(agent, c.payload(payload), options, done);
    });
  });
};

exports.execAll = (agent, payload, options) => {
  cases.forEach( c => {
    it(c.description(options), function(done) {
      _exec(agent, c.payload(payload), options, function(err, res) {
        done();
      });
    });
  });
};