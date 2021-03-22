"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadError = void 0;
/**
 * @description Type upload error
 */
class UploadError {
    constructor(error) {
        this.name = 'UploadError';
        this.statusCode = 400;
        this.statusText = error.name;
        this.errors = [error.message];
        this.stack = error?.stack;
    }
}
exports.UploadError = UploadError;
