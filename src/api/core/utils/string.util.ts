import { readFileSync, writeFileSync } from 'fs';
import { createDecipheriv, createCipheriv,randomBytes } from 'crypto';
import { DOCUMENT_MIME_TYPE, ARCHIVE_MIME_TYPE, IMAGE_MIME_TYPE, AUDIO_MIME_TYPE, VIDEO_MIME_TYPE } from '@enums';
import { MediaType } from '@types';

import { list } from '@utils/enum.util';

const chars   = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
const numbers = ['0','1','2','3','4','5','6','7','8','9'];
const symbols = ['@','#','&','$','.'];

const algorithm = 'aes-256-cbc';
const key = randomBytes(32);
const iv = randomBytes(16);

/**
 * @decription Shuffle an array | string as array of chars
 *
 * @param a
 */
const shuffle = (a: string[]): string => {
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
 * @description Decrypt text
 *
 * @param cipherText
 */
const decrypt = (cipherText: string): string => {
  const decipher = createDecipheriv(algorithm, key, iv)
  return decipher.update(cipherText, 'hex', 'utf8') + decipher.final('utf8')
};

/**
 * @description Encrypt text
 *
 * @param text
 */
const encrypt = (text: string): string => {
  const cipher = createCipheriv(algorithm, key, iv)
  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
}

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
const getTypeOfMedia = (mimetype: string): string => {
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

/**
 *
 * @param type
 */
const getMimeTypesOfType = (type: MediaType): string[] => {
  switch(type) {
    case 'archive':
      return list(ARCHIVE_MIME_TYPE);
    case 'audio':
      return list(AUDIO_MIME_TYPE);
    case 'document':
      return list(DOCUMENT_MIME_TYPE);
    case 'image':
      return list(IMAGE_MIME_TYPE);
    case 'video':
      return list(VIDEO_MIME_TYPE);
  }
}

export { base64Encode, base64Decode, decrypt, encrypt, extension, getTypeOfMedia, getMimeTypesOfType, foldername, hash, shuffle };