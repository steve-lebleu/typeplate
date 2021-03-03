import { readFileSync, writeFileSync } from 'fs';
import { DOCUMENT_MIME_TYPE, ARCHIVE_MIME_TYPE, IMAGE_MIME_TYPE, AUDIO_MIME_TYPE, VIDEO_MIME_TYPE } from '@enums/mime-type.enum';

const chars   = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
const numbers = ['0','1','2','3','4','5','6','7','8','9'];
const symbols = ['@','#','&','$','.'];

/**
 * @decription Shuffle an array | string as array of chars
 *
 * @param a
 */
const shuffle = (a: any[]): string => {
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
    .map( (letter: string) => table.reverse()[table.lastIndexOf(letter)] as string)
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
 * @param name Filename to parse
 */
const foldername = (name: string): string => {
  return name.lastIndexOf('.') !== -1 ? name.substring(0, name.lastIndexOf('.')) : name;
};

/**
 * @description Get file extension with or without .
 * @param name Filename to parse
 * @param include Get extension with . if true, without . else
 */
const extension = (name: string, include = false): string => {
  return name.lastIndexOf('.') !== -1 ? include === true ? name.substring(name.lastIndexOf('.')) : name.substring(name.lastIndexOf('.') + 1) : name;
};

/**
 * @description Determine media type from mime type
 * @param mimetype
 */
const fieldname = (mimetype: string): string => {
  if ( DOCUMENT_MIME_TYPE[mimetype] ) {
    return 'document'
  }

  if ( ARCHIVE_MIME_TYPE[mimetype] ) {
    return 'archive';
  }

  if ( IMAGE_MIME_TYPE[mimetype] ) {
    return 'image';
  }

  if ( AUDIO_MIME_TYPE[mimetype] ) {
    return 'audio';
  }

  if ( VIDEO_MIME_TYPE[mimetype] ) {
    return 'video';
  }

};

export { shuffle, hash, crypt, base64Encode, base64Decode, foldername, extension, fieldname };