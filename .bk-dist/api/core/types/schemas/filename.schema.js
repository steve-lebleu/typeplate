"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filename = void 0;
const Joi = require("joi");
const filename = (extension = true) => {
    return extension ? Joi.string().regex(/^[a-z-A-Z-0-9\-\_]{1,123}\.[a-z-0-9]{1,5}$/i) : Joi.string().regex(/^[a-z-A-Z-0-9\-\_\w]{1,123}$/i);
};
exports.filename = filename;
