"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
/**
 * @description Custom NotFoundError
 */
class NotFoundError {
    constructor(error) {
        this.name = 'NotFoundError';
        this.statusCode = 404;
        this.statusText = 'Bad request';
        this.errors = [error.message];
        this.stack = error?.stack;
    }
}
exports.NotFoundError = NotFoundError;
