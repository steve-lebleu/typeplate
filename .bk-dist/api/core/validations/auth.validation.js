"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthCb = exports.refresh = exports.login = exports.register = void 0;
const Joi = require("joi");
const _schemas_1 = require("@schemas");
// POST api/v1/auth/register
const register = {
    body: Joi.object({
        email: _schemas_1.email().required(),
        password: _schemas_1.password('user').required()
    })
};
exports.register = register;
// POST api/v1/auth/login
const login = {
    body: Joi.object({
        email: Joi.when('context.apikey', {
            is: null,
            then: _schemas_1.email().required(),
            otherwise: Joi.optional()
        }),
        password: Joi.when('context.apikey', {
            is: null,
            then: _schemas_1.password('user').required(),
            otherwise: Joi.optional()
        }),
        apikey: Joi.when('context.password', {
            is: null,
            then: Joi.string().length(64).required(),
            otherwise: Joi.optional()
        })
    })
};
exports.login = login;
// POST api/v1/auth/refresh
const refresh = {
    body: Joi.object({
        token: Joi.object().keys({
            refreshToken: Joi.string().min(82).max(88).required(),
        }).required()
    })
};
exports.refresh = refresh;
// GEET api/v1/auth/:service/callback
const oauthCb = {
    query: Joi.object({
        code: Joi.string().min(8).max(88).required(),
    })
};
exports.oauthCb = oauthCb;
