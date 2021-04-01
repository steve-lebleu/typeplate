const { expect } = require('chai');
const { existsSync } = require('fs');
const Util = require('util');

exports.routes = {
  users: [
    {
      method: 'GET',
      path: '',
      query: {},
      params: {},
      tests: [
        { 
          statusCode: 400
        },
        { 
          statusCode: 403
        },
        { 
          statusCode: 200
        }
      ]
    }
  ],
  medias: {}
};

exports.pools = {
  password: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  username: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
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

const _doRequest = (agent, method, route, id, token, payload, callback) => {
  const path = id !== null ? `${route}${id}` : route;
  return agent[method](path)
    .set('Authorization', 'Bearer ' + token)
    .set('Accept', process.env.CONTENT_TYPE)
    .set('Content-Type', process.env.CONTENT_TYPE)
    .set('Origin', process.env.ORIGIN)
    .send(payload)
    .end(function(err, res) {
      callback(err, res);
    });
};

exports.doRequest = _doRequest;

const _doQueryRequest = (agent, route, id, token, payload, callback) => {
  const path = id !== null ? `${route}${id}` : route;
  return agent.get(path)
    .set('Authorization', 'Bearer ' + token)
    .set('Accept', process.env.CONTENT_TYPE)
    .set('Content-Type', process.env.CONTENT_TYPE)
    .set('Origin', process.env.ORIGIN)
    .query(payload)
    .end(function(err, res) {
      callback(err, res);
    });
};

exports.doQueryRequest = _doQueryRequest;

const _doFormRequest = (agent, method, route, id, token, payload, callback) => {
  const path = id !== null ? `${route}${id}` : route;
  return agent[method](path)
    .set('Authorization', 'Bearer ' + token)
    .set('Accept', process.env.CONTENT_TYPE)
    .set('Content-Type', 'multipart/form-data')
    .set('Origin', process.env.ORIGIN)
    .attach(payload.name, payload.path)
    .end(function(err, res) {
      callback(err, res);
    });
};

exports.doFormRequest = _doFormRequest;

const _expectations = (res, field, err) => {
  expect(res.body.statusCode).to.eqls(400);
  expect(res.body.errors).to.be.an('array').length.gt(0);
  expect(res.body.errors).satisfy(function(value) {
    return value.filter( error => error.field === field && error.types.includes(err)).length >= 1;
  });
};

exports.expectations = _expectations;

exports.dataOk = (res, entity, method) => {
  const models = [
    {
      name: 'user',
      expect: () => {
        // expect(res.body).to.have.all.keys('id', 'username', 'email', 'role', 'createdAt', 'updatedAt');
        expect(res.body).to.have.not.keys(['password', 'apikey']);
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
        expect(res.body).to.have.all.keys(['id', 'fieldname', 'filename', 'mimetype', 'size', 'createdAt', 'updatedAt', 'owner']);
        expect(res.body.id).to.be.a('number');
        expect(res.body.fieldname).to.be.a('string');
        expect(res.body.filename).to.be.a('string');
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