const expect = require('chai').expect;

const { MEDIA } = require(process.cwd() + '/dist/api/types/enums/media.enum');

const { getAge } = require(process.cwd() + '/dist/api/utils/date.util');
const { getErrorStatusCode } = require(process.cwd() + '/dist/api/utils/error.util');
const { list } = require(process.cwd() + '/dist/api/utils/enum.util');
const { getTypeOfMedia, getMimeTypesOfType, hash, encrypt, decrypt, shuffle, base64Decode, base64Encode } = require(process.cwd() + '/dist/api/utils/string.util');


var fs = require('fs');

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

    it('getErrorStatusCode() returns status when status property match', function(done) {
      const result = getErrorStatusCode({ status: 400 });
      expect(result).to.eqls(400);
      done();
    });

    it('getErrorStatusCode() returns statusCode when statusCode property match', function(done) {
      const result = getErrorStatusCode({ statusCode: 400 });
      expect(result).to.eqls(400);
      done();
    });

    it('getErrorStatusCode() returns output.statusCode when output.statusCode property match', function(done) {
      const result = getErrorStatusCode({ output: { statusCode: 400 } });
      expect(result).to.eqls(400);
      done();
    });

    it('getErrorStatusCode() returns a 500 status if no match', function(done) {
      const err = { name: 'QueryFailedError', errno: 1052, sqlMessage: 'Duplicate entry \'lambda\' for key \'IDX_78a916df40e02a9deb1c4b75ed\'' };
      const result = getErrorStatusCode(err);
      expect(result).to.eqls(500);
      done();
    });
  
  });

  describe('String', () => {
  
    it('shuffle() returns a shuffled value', function() {
      const array = [0,1,2,3,4,5];
      const phrase = 'Test string';
      expect(shuffle(array)).to.not.eqls(array);
      expect(shuffle(phrase.split(''))).to.be.a('string');
      expect(shuffle(phrase.split(''))).to.not.eqls(phrase);
    });
  
    it('hash() returns a shuffled value to n', function() {
      const phrase = 'Test string';
      const h = hash(phrase,8);
      expect(h).to.be.a('string');
      expect(h).to.not.eqls(phrase);
      expect(h.length).to.eqls(8);
    });
  
    it('base64Encode() returns a base64 encoded string', function() {
      const origine = process.cwd() + '/test/utils/fixtures/files/javascript.jpg';
      const base64Encoded = base64Encode(origine);
      expect(base64Encoded).to.be.a('string');
      expect(base64Encoded).match(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/)
    });
  
    it('base64Decode() write ascii file', function(done) {
      const origine = process.cwd() + '/test/utils/fixtures/files/javascript.jpg';
      const copy = process.cwd() + '/test/utils/fixtures/files/javascript-rewrited.jpg';
      const stream = fs.readFileSync(origine);
      base64Decode(stream, copy);
      expect( fs.statSync(copy).isFile() ).to.eqls(true);
      expect( fs.statSync(copy).size ).to.eqls( fs.statSync(origine).size );
      fs.unlinkSync(copy);
      done();
    });

    it('decrypt() should returns original string', function() {
      const string = 'totowasaheroes';
      const encrypted = encrypt(string);
      expect(decrypt(encrypted)).to.be.eqls(string)
    });

    it('encrypt() should returns encrypted string', function() {
      const string = 'totowasaheroes';
      expect(encrypt(string)).to.be.not.eqls(string)
    });
    
    it('getTypeOfMedia() should returns audio', function() {
      expect(getTypeOfMedia('audio/mp3')).to.be.eqls('audio');
    });

    it('getTypeOfMedia() should returns archive', function() {
      expect(getTypeOfMedia('application/zip')).to.be.eqls('archive');
    });

    it('getTypeOfMedia() should returns document', function() {
      expect(getTypeOfMedia('application/pdf')).to.be.eqls('document');
    });

    it('getTypeOfMedia() should returns image', function() {
      expect(getTypeOfMedia('image/jpg')).to.be.eqls('image');
    });

    it('getTypeOfMedia() should returns video', function() {
      expect(getTypeOfMedia('video/mp4')).to.be.eqls('video');
    });

  });

});


