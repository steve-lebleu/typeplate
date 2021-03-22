"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = void 0;
/**
 * @description Type native error
 */
class ServerError {
    constructor(error) {
        this.name = 'ServerError';
        this.statusCode = 500;
        this.statusText = 'Ooops... server seems to be broken';
        this.errors = ['Looks like someone\'s was not there while the meeting\''];
        this.stack = error?.stack;
    }
}
exports.ServerError = ServerError;
