"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = void 0;
const Joi = require("joi");
const port = () => {
    return Joi.number().port();
};
exports.port = port;
