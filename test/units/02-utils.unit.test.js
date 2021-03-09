const expect = require('chai').expect;

const { MEDIA } = require(process.cwd() + '/dist/api/types/enums/media.enum');

const { getAge } = require(process.cwd() + '/dist/api/utils/date.util');
const { getErrorStatusCode } = require(process.cwd() + '/dist/api/utils/error.util');
const { list } = require(process.cwd() + '/dist/api/utils/enum.util');
const { isSanitizable, sanitize } = require(process.cwd() + '/dist/api/utils/sanitize.util');

var str = {}; str.util = require(process.cwd() + '/dist/api/utils/string.util');

var fs = require('fs');
var UnknownError = function(message) { this.message = message; return this; };

describe('Utils', () => {

  describe('Date', () => {

    it('getAge() should return 41 as a number', function(done) {
      const result = getAge(new Date(1979,7,28).toDateString());
      expect(result).to.eqls(41);
      done();
    });

  });

  describe('Enum', () => {

    it('list() should return an array of strings', function(done) {
      const result = list(MEDIA);
      expect(result).to.an('array');
      result.forEach(element => {
        expect(element).to.be.a('string');
      });
      done();
    });

  });

  describe('Error', () => {

    it("getErrorStatusCode() returns status when status property match", function(done) {
      const result = getErrorStatusCode({ status: 400 });
      expect(result).to.eqls(400);
      done();
    });

    it("getErrorStatusCode() returns statusCode when statusCode property match", function(done) {
      const result = getErrorStatusCode({ statusCode: 400 });
      expect(result).to.eqls(400);
      done();
    });

    it("getErrorStatusCode() returns output.statusCode when output.statusCode property match", function(done) {
      const result = getErrorStatusCode({ output: { statusCode: 400 } });
      expect(result).to.eqls(400);
      done();
    });

    it("getErrorStatusCode() returns a 500 status if no match", function(done) {
      const err = { name: 'QueryFailedError', errno: 1052, sqlMessage: "Duplicate entry 'lambda' for key 'IDX_78a916df40e02a9deb1c4b75ed'" };
      const result = getErrorStatusCode(err);
      expect(result).to.eqls(500);
      done();
    });
  
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

    it('isSanitizable() should return true on mixed array', function(done) {
      const result = isSanitizable([{ name: 'yoda'}, 'dark vador']);
      expect(result).to.be.true;
      done();
    });

    it.skip('isSanitizable() should work better with types', function(done) {
      done();
    });

    it('sanitize() should return sanitized object', function(done) {
      const wildcards = ['id', 'name'];
      const entity = function() {
        const self = {};
        self.id = 1;
        self.name = 'Yoda';
        self.password = '123456'
        return self
      }
      const result = sanitize(wildcards, new entity());
      expect(result).to.haveOwnProperty('id');
      expect(result).to.haveOwnProperty('name');
      expect(result).to.not.haveOwnProperty('password');
      done();
    });

    it.skip('sanitize() should work better with array/embeded objects', function(done) {
      done();
    });

  });

  describe("String", () => {
  
    it("shuffle() returns a shuffled value", function() {
      const array = [0,1,2,3,4,5];
      const phrase = "I'm a test string";
      expect(str.util.shuffle(array)).to.not.eqls(array);
      expect(str.util.shuffle(phrase.split(''))).to.be.a('string');
      expect(str.util.shuffle(phrase.split(''))).to.not.eqls(phrase);
    });
  
    it("hash() returns a shuffled value to n", function() {
      const phrase = "I'm a test string";
      const hash = str.util.hash(phrase,8);
      expect(hash).to.be.a('string');
      expect(hash).to.not.eqls(phrase);
      expect(hash.length).to.eqls(8);
    });
  
    it("base64Encode() returns a base64 encoded string", function() {
      const origine = process.cwd() + '/test/utils/fixtures/files/javascript.jpg';
      const base64Encoded = str.util.base64Encode(origine);
      expect(base64Encoded).to.be.a('string');
      expect(base64Encoded).match(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/)
  
    });
  
    it("base64Decode() write ascii file", function(done) {
      const origine = process.cwd() + '/test/utils/fixtures/files/javascript.jpg';
      const copy = process.cwd() + '/test/utils/fixtures/files/javascript-rewrited.jpg';
      const stream = fs.readFileSync(origine);
      str.util.base64Decode(stream, copy);
      expect( fs.statSync(copy).isFile() ).to.eqls(true);
      expect( fs.statSync(copy).size ).to.eqls( fs.statSync(origine).size );
      fs.unlinkSync(copy);
      done();
    });
  
  });

});


