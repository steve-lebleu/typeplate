"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = void 0;
const Joi = require("joi");
const name = () => {
    return Joi.string().max(32);
};
exports.name = name;
