import { readFileSync, writeFileSync } from 'fs';
import { DOCUMENT_MIME_TYPE, ARCHIVE_MIME_TYPE, IMAGE_MIME_TYPE } from '@enums/mime-type.enum';

const chars   = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
const numbers = ['0','1','2','3','4','5','6','7','8','9'];
const symbols = ['@','#','&','$','.'];

/**
 * @decription Shuffle an array | string as array of chars
 *
 * @param a
 */
const shuffle = (a: any[]) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.join('');
};

/**
 * @description Hash a string
 *
 * @param str Base string to hash
 * @param length Number of chars to return
 */
const hash = (str: string, length: number): string => {
  const array = str.split('').concat(chars).concat(numbers).concat(symbols);
  return shuffle(array).substr(0, length);
};

/**
 * @description Crypt a string
 *
 * @param str Base string to crypt
 * @param length Number of chars to return
 */
const crypt = (str: string, length: number): string => {
  const table = [].concat(chars).concat(numbers).concat(symbols);
  return str
    .split('')
    .map( (letter: string) => {
      const index = table.lastIndexOf(letter);
      return table.reverse()[index];
    })
    .join('')
    .substr(0, length);
};

/**
 * @description Encode binary file in base64
 * @param path
 */
const base64Encode = (path: string): string => {
  const stream = readFileSync(path);
  return stream.toString('base64');
};

/**
 * @description Decode base64 encoded stream and write binary file
 * @param path
 */
const base64Decode = (stream: Buffer, path: string): void => {
  const size = stream.toString('ascii').length;
  writeFileSync(path, Buffer.alloc(size, stream, 'ascii'));
};

/**
 * @description Get filename without extension
 * @param filename Filename to parse
 */
const filename = (filename: string) => {
  return filename.lastIndexOf('.') !== -1 ? filename.substring(0, filename.lastIndexOf('.')) : filename;
};

/**
 * @description Get file extension with or without .
 * @param filename Filename to parse
 * @param include Get extension with . if true, without . else
 */
const extension = (filename: string, include = false) => {
  return filename.lastIndexOf('.') !== -1 ? include === true ? filename.substring(filename.lastIndexOf('.')) : filename.substring(filename.lastIndexOf('.') + 1) : filename;
};

/**
 * @description Determine document type from mime type
 * @param mimetype
 */
const fieldname = (mimetype: string) => {
  const mimes = {
    document: DOCUMENT_MIME_TYPE,
    archive: ARCHIVE_MIME_TYPE,
    image: IMAGE_MIME_TYPE
  };
  let is = null;
  for(const key in mimes) {
    if (typeof mimes[key][mimetype] !== 'undefined') {
      is = key;
    }
  }
  return is;
};

export { shuffle, hash, crypt, base64Encode, base64Decode, filename, extension, fieldname };