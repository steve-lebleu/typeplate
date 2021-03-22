"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorFactory = void 0;
const boom_1 = require("@hapi/boom");
const _errors_1 = require("@errors");
const error_util_1 = require("@utils/error.util");
/**
 * @description
 */
class ErrorFactory {
    /**
     * @description
     *
     * @param error
     */
    static get(error) {
        // Custom errors first
        switch (error.name) {
            case 'QueryFailedError':
                return new _errors_1.MySQLError(error);
            case 'MulterError':
                return new _errors_1.UploadError(error);
            case 'EntityNotFound':
            case 'MustBeEntityError':
                return new _errors_1.NotFoundError(error);
            case 'ValidationError':
                return new _errors_1.ValidationError(error);
        }
        // JS native errors ( Error | EvalError | RangeError | SyntaxError | TypeError | URIError )
        if (!error.httpStatusCode && !error.statusCode && !error.status && !error?.output?.statusCode) {
            switch (error.constructor.name) {
                case 'Error':
                case 'EvalError':
                case 'TypeError':
                case 'SyntaxError':
                case 'RangeError':
                case 'URIError':
                    return new _errors_1.ServerError(error);
                default:
                    error = boom_1.badImplementation(error.message);
            }
        }
        // Fallback with Boom error
        if (error.isBoom) {
            return {
                statusCode: error_util_1.getErrorStatusCode(error),
                statusText: error.output.payload.error,
                errors: [error.output.payload.message]
            };
        }
    }
}
exports.ErrorFactory = ErrorFactory;
