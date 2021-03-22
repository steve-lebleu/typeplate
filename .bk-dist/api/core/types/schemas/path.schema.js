"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.path = void 0;
const Joi = require("joi");
const path = () => {
    return Joi.string().regex(/^[a-z-A-Z-0-9\-\_\/]{1,}\.[a-z-0-9]{1,5}$/i);
};
exports.path = path;
