"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.email = void 0;
const Joi = require("joi");
const email = () => {
    return Joi.string().email();
};
exports.email = email;
