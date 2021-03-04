var expect = require('chai').expect;

var UserSerializer = require(process.cwd() + '/dist/api/serializers/user.serializer');
var MediaSerializer = require(process.cwd() + '/dist/api/serializers/media.serializer');

var error = {}; error.util = require(process.cwd() + '/dist/api/utils/error.util');
var serializer = {}; serializer.util = require(process.cwd() + '/dist/api/utils/serializing.util');
var str = {}; str.util = require(process.cwd() + '/dist/api/utils/string.util');

var fs = require('fs');

describe("Units tests", function () {
  
  var UnknownError = function(message) { this.message = message; return this; };

  before(function (done) { done(); });
  
  after(function () {});

  describe("Utils", function() {

    describe("Errors", function() {
      
      it("getErrorStatusCode() returns a 500 status if argument error don't match", function(done) {
        const err = { name: 'QueryFailedError', errno: 1052, sqlMessage: "Duplicate entry 'lambda' for key 'IDX_78a916df40e02a9deb1c4b75ed'" };
        const result = error.util.getErrorStatusCode(err);
        expect(result).to.eqls(500);
        done();
      });

      [Error,TypeError,EvalError,RangeError,SyntaxError,URIError,UnknownError].forEach( (e) => {
        it(`getErrorOutput() boomify ${e} and get 500 with masked details`, function(done) {
          const err = new e('This error will be boomified');
          const result = error.util.getErrorOutput(err);
          expect(result.statusCode).to.eqls(500);
          result.errors.map( e => expect(e).to.eqls('An internal server error occurred'));
          done();
        });
      });

    });

    describe("Serializer", function() {

      it("getSerializer() returns User serializer", function(done) {
        const serializerName = 'User';
        const result = serializer.util.getSerializer( serializerName );
        expect(result).to.be.instanceOf(UserSerializer.constructor);
        done();
      });

      it("getSerializer() returns Media serializer", function(done) {
        const serializerName = 'Media';
        const result = serializer.util.getSerializer( serializerName );
        expect(result).to.be.instanceOf(MediaSerializer.constructor);
        done();
      });

      it("getSerializer() throws TypeError if unknown entity", function(done) {
        const serializerName = 'Trucmuche';
        try {
          serializer.util.getSerializer( serializerName );
        } catch (e) {
          expect(e).to.be.instanceOf(TypeError);
        }    
        done();
      });

    });

    describe("String", function() {

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

        const origine = process.cwd() + '/test/fixtures/files/javascript.jpg';

        const base64Encoded = str.util.base64Encode(origine);

        expect(base64Encoded).to.be.a('string');
        expect(base64Encoded).match(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/)

      });

      it("base64Decode() write ascii file", function(done) {

        const origine = process.cwd() + '/test/fixtures/files/javascript.jpg';
        const copy = process.cwd() + '/test/fixtures/files/javascript-rewrited.jpg';

        const stream = fs.readFileSync(origine);

        str.util.base64Decode(stream, copy);
        
        expect( fs.statSync(copy).isFile() ).to.eqls(true);
        expect( fs.statSync(copy).size ).to.eqls( fs.statSync(origine).size );
        
        fs.unlinkSync(copy);

        done();

      });

    });

  });

});