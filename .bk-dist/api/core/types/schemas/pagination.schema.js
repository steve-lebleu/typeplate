"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagination = void 0;
const Joi = require("joi");
const pagination = (filter) => {
    const filters = {
        page: Joi.number().min(1),
        perPage: Joi.number().min(1).max(100)
    };
    return filters[filter];
};
exports.pagination = pagination;
