"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Safe = void 0;
const media_service_1 = require("@services/media.service");
/**
 * @decorator Safe
 *
 * @description Endpoint decorator which catch errors fired while endpoint execution
 *
 * @param target Endpoint method reference
 * @param key Endpoint name
 */
const Safe = () => {
    return (target, key) => {
        const method = target[key];
        target[key] = function (...args) {
            const { files } = args[0];
            const next = args[2];
            const result = method.apply(this, args);
            if (result && result instanceof Promise) {
                result
                    .then(() => next())
                    .catch(e => {
                    if (files && files.length > 0) {
                        files.map(f => media_service_1.MediaService.remove(f));
                    }
                    next(e);
                });
            }
        };
        return target[key];
    };
};
exports.Safe = Safe;
