"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatusCode = void 0;
const http_status_1 = require("http-status");
/**
 * @description Get the HTTP status code to output for current request
 *
 * @param method
 * @param hasContent
 */
const getStatusCode = (method, hasContent) => {
    switch (method) {
        case 'GET':
            return http_status_1.OK;
        case 'POST':
            return hasContent ? http_status_1.CREATED : http_status_1.NO_CONTENT;
        case 'PUT':
        case 'PATCH':
            return hasContent ? http_status_1.OK : http_status_1.NO_CONTENT;
        case 'DELETE':
            return http_status_1.NO_CONTENT;
    }
};
exports.getStatusCode = getStatusCode;
