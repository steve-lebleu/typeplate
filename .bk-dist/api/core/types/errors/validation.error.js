"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
/**
 * Type upload error
 */
class ValidationError {
    constructor(error) {
        this.name = 'ValidationError';
        this.statusCode = 400;
        this.statusText = 'Validation error';
        this.errors = this.convertError(error.details);
        this.stack = error?.stack;
    }
    /**
     * @description Convert Joi validation errors into strings
     *
     * @param errors Array of Joi validation errors
     */
    convertError(errors) {
        return errors.map((err) => err.message.replace(/"/g, '\''));
    }
}
exports.ValidationError = ValidationError;
