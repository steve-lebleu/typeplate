"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldname = void 0;
const Joi = require("joi");
const fieldname = () => {
    return Joi.string().regex(/^[a-z\-]{1,24}$/i);
};
exports.fieldname = fieldname;
