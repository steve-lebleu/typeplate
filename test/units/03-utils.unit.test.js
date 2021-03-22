const expect = require('chai').expect;

const { MEDIA } = require(process.cwd() + '/dist/api/core/types/enums/media-type.enum');

const { getAge } = require(process.cwd() + '/dist/api/core/utils/date.util');
const { getErrorStatusCode } = require(process.cwd() + '/dist/api/core/utils/error.util');
const { list } = require(process.cwd() + '/dist/api/core/utils/enum.util');
const { getTypeOfMedia, getMimeTypesOfType, hash, encrypt, decrypt, shuffle, base64Decode, base64Encode } = require(process.cwd() + '/dist/api/core/utils/string.util');

var fs = require('fs');

describe('Utils', () => {

  describe('Date', () => {

    describe('getAge()', () => {

      it('should return 41 as a number', function(done) {
        const result = getAge(new Date(1979,7,28).toDateString());
        expect(result).to.eqls(41);
        done();
      });
  
    });

  });

  describe('Enum', () => {

    describe('list()', () => {

      it('should return an array of strings', function(done) {
        const result = list(MEDIA);
        expect(result).to.an('array');
        result.forEach(element => {
          expect(element).to.be.a('string');
        });
        done();
      });
  
    });

  });

  describe('Error', () => {

    describe('getErrorStatusCode()', () => {

      it('should returns status when status property match', function(done) {
        const result = getErrorStatusCode({ status: 400 });
        expect(result).to.eqls(400);
        done();
      });
  
      it('should returns statusCode when statusCode property match', function(done) {
        const result = getErrorStatusCode({ statusCode: 400 });
        expect(result).to.eqls(400);
        done();
      });
  
      it('should returns output.statusCode when output.statusCode property match', function(done) {
        const result = getErrorStatusCode({ output: { statusCode: 400 } });
        expect(result).to.eqls(400);
        done();
      });
  
      it('should returns a 500 status if no match', function(done) {
        const err = { name: 'QueryFailedError', errno: 1052, sqlMessage: 'Duplicate entry \'lambda\' for key \'IDX_78a916df40e02a9deb1c4b75ed\'' };
        const result = getErrorStatusCode(err);
        expect(result).to.eqls(500);
        done();
      });

    });


  });

  describe('String', () => {
  
    describe('suffle()', () => {

      it('should returns a shuffled value', function() {
        const array = [0,1,2,3,4,5];
        const phrase = 'Test string';
        expect(shuffle(array)).to.not.eqls(array);
        expect(shuffle(phrase.split(''))).to.be.a('string');
        expect(shuffle(phrase.split(''))).to.not.eqls(phrase);
      });

    });

    describe('hash()', () => {

      it('should returns a shuffled value to n', function() {
        const phrase = 'Test string';
        const h = hash(phrase,8);
        expect(h).to.be.a('string');
        expect(h).to.not.eqls(phrase);
        expect(h.length).to.eqls(8);
      });

    });

    describe('base64Encode()', () => {

      it('should returns a base64 encoded string', function() {
        const origine = process.cwd() + '/test/utils/fixtures/files/javascript.jpg';
        const base64Encoded = base64Encode(origine);
        expect(base64Encoded).to.be.a('string');
        expect(base64Encoded).match(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/)
      });

    });

    describe('base64Decode()', () => {

      it('should write ascii file', function(done) {
        const origine = process.cwd() + '/test/utils/fixtures/files/javascript.jpg';
        const copy = process.cwd() + '/test/utils/fixtures/files/javascript-rewrited.jpg';
        const stream = fs.readFileSync(origine);
        base64Decode(stream, copy);
        expect( fs.statSync(copy).isFile() ).to.eqls(true);
        expect( fs.statSync(copy).size ).to.eqls( fs.statSync(origine).size );
        fs.unlinkSync(copy);
        done();
      });

    });

    describe('decrypt()', () => {

      it('should returns original string', function() {
        const string = 'totowasaheroes';
        const encrypted = encrypt(string);
        expect(decrypt(encrypted)).to.be.eqls(string)
      });

    });

    describe('encrypt()', () => {

      it('should returns encrypted string', function() {
        const string = 'totowasaheroes';
        expect(encrypt(string)).to.be.not.eqls(string)
      });

    });

    describe('getTypeOfMedia()', () => {

      it('should returns audio', function() {
        expect(getTypeOfMedia('audio/mp3')).to.be.eqls('audio');
      });
  
      it('should returns archive', function() {
        expect(getTypeOfMedia('application/zip')).to.be.eqls('archive');
      });
  
      it('should returns document', function() {
        expect(getTypeOfMedia('application/pdf')).to.be.eqls('document');
      });
  
      it('should returns image', function() {
        expect(getTypeOfMedia('image/jpg')).to.be.eqls('image');
      });
  
      it('should returns video', function() {
        expect(getTypeOfMedia('video/mp4')).to.be.eqls('video');
      });

    });

    describe('getMimeTypesOfType()', () => {

      ['archive', 'audio', 'document', 'image', 'video'].forEach(type => {

        it(`should returns ${type} mime types`, (done) => {
          const result = getMimeTypesOfType(type);
          result.forEach(r => {
            expect(getTypeOfMedia(r)).to.be.eqls(type);
          })
          done();
        });

      });

    });

  });

});


