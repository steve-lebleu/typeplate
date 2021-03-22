"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.username = void 0;
const Joi = require("joi");
const username = () => {
    return Joi.string().max(32);
};
exports.username = username;
