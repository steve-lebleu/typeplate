"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.host = void 0;
const Joi = require("joi");
const host = (type) => {
    const types = [
        {
            type: 'smtp',
            schema: Joi.string().regex(/^[a-z-0-9\-]{2,12}\.[a-z]{2,16}\.[a-z]{2,8}$/i)
        }
    ];
    return types.filter(h => h.type === type).slice().shift().schema;
};
exports.host = host;
