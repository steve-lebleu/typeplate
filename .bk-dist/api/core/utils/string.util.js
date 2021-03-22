"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffle = exports.hash = exports.foldername = exports.getMimeTypesOfType = exports.getTypeOfMedia = exports.extension = exports.encrypt = exports.decrypt = exports.base64Decode = exports.base64Encode = void 0;
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const _enums_1 = require("@enums");
const enum_util_1 = require("@utils/enum.util");
const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const symbols = ['@', '#', '&', '$', '.'];
const algorithm = 'aes-256-cbc';
const key = crypto_1.randomBytes(32);
const iv = crypto_1.randomBytes(16);
/**
 * @decription Shuffle an array | string as array of chars
 *
 * @param a
 */
const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a.join('');
};
exports.shuffle = shuffle;
/**
 * @description Hash a string
 *
 * @param str Base string to hash
 * @param length Number of chars to return
 */
const hash = (str, length) => {
    const array = str.split('').concat(chars).concat(numbers).concat(symbols);
    return shuffle(array).substr(0, length);
};
exports.hash = hash;
/**
 * @description Encode binary file in base64
 * @param path
 */
const base64Encode = (path) => {
    const stream = fs_1.readFileSync(path);
    return stream.toString('base64');
};
exports.base64Encode = base64Encode;
/**
 * @description Decode base64 encoded stream and write binary file
 * @param path
 */
const base64Decode = (stream, path) => {
    const size = stream.toString('ascii').length;
    fs_1.writeFileSync(path, Buffer.alloc(size, stream, 'ascii'));
};
exports.base64Decode = base64Decode;
/**
 * @description Decrypt text
 *
 * @param cipherText
 */
const decrypt = (cipherText) => {
    const decipher = crypto_1.createDecipheriv(algorithm, key, iv);
    return decipher.update(cipherText, 'hex', 'utf8') + decipher.final('utf8');
};
exports.decrypt = decrypt;
/**
 * @description Encrypt text
 *
 * @param text
 */
const encrypt = (text) => {
    const cipher = crypto_1.createCipheriv(algorithm, key, iv);
    return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
};
exports.encrypt = encrypt;
/**
 * @description Get filename without extension
 * @param name Filename to parse
 */
const foldername = (name) => {
    return name.lastIndexOf('.') !== -1 ? name.substring(0, name.lastIndexOf('.')) : name;
};
exports.foldername = foldername;
/**
 * @description Get file extension with or without .
 * @param name Filename to parse
 * @param include Get extension with . if true, without . else
 */
const extension = (name, include = false) => {
    return name.lastIndexOf('.') !== -1 ? include === true ? name.substring(name.lastIndexOf('.')) : name.substring(name.lastIndexOf('.') + 1) : name;
};
exports.extension = extension;
/**
 * @description Determine media type from mime type
 * @param mimetype
 */
const getTypeOfMedia = (mimetype) => {
    if (_enums_1.DOCUMENT_MIME_TYPE[mimetype]) {
        return 'document';
    }
    if (_enums_1.ARCHIVE_MIME_TYPE[mimetype]) {
        return 'archive';
    }
    if (_enums_1.IMAGE_MIME_TYPE[mimetype]) {
        return 'image';
    }
    if (_enums_1.AUDIO_MIME_TYPE[mimetype]) {
        return 'audio';
    }
    if (_enums_1.VIDEO_MIME_TYPE[mimetype]) {
        return 'video';
    }
};
exports.getTypeOfMedia = getTypeOfMedia;
/**
 *
 * @param type
 */
const getMimeTypesOfType = (type) => {
    switch (type) {
        case 'archive':
            return enum_util_1.list(_enums_1.ARCHIVE_MIME_TYPE);
        case 'audio':
            return enum_util_1.list(_enums_1.AUDIO_MIME_TYPE);
        case 'document':
            return enum_util_1.list(_enums_1.DOCUMENT_MIME_TYPE);
        case 'image':
            return enum_util_1.list(_enums_1.IMAGE_MIME_TYPE);
        case 'video':
            return enum_util_1.list(_enums_1.VIDEO_MIME_TYPE);
    }
};
exports.getMimeTypesOfType = getMimeTypesOfType;
