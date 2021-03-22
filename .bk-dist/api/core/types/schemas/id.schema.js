"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.id = void 0;
const Joi = require("joi");
const id = () => {
    return Joi.string().regex(/^[0-9]{1,4}$/).required();
};
exports.id = id;
