"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mimetype = void 0;
const Joi = require("joi");
const mimetype = (mimetypes) => {
    return Joi.any().valid(...mimetypes);
};
exports.mimetype = mimetype;
