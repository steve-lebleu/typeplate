"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorStatusCode = void 0;
/**
 * @description Get error status code
 * @param error Error object
 * @returns HTTP status code
 */
const getErrorStatusCode = (error) => {
    if (typeof (error.statusCode) !== 'undefined')
        return error.statusCode;
    if (typeof (error.status) !== 'undefined')
        return error.status;
    if (typeof (error?.output?.statusCode) !== 'undefined')
        return error.output.statusCode;
    return 500;
};
exports.getErrorStatusCode = getErrorStatusCode;
