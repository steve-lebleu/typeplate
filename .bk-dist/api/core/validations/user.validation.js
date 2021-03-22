"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUser = exports.updateUser = exports.replaceUser = exports.createUser = exports.getUser = exports.listUsers = void 0;
const Joi = require("joi");
const _enums_1 = require("@enums");
const enum_util_1 = require("@utils/enum.util");
const _schemas_1 = require("@schemas");
// GET api/v1/users
const listUsers = {
    query: Joi.object({
        page: _schemas_1.pagination('page'),
        perPage: _schemas_1.pagination('perPage'),
        username: _schemas_1.username(),
        email: _schemas_1.email(),
        role: Joi.any().valid(...enum_util_1.list(_enums_1.ROLE))
    })
};
exports.listUsers = listUsers;
// GET api/v1/users/userId
const getUser = {
    params: Joi.object({
        userId: _schemas_1.id()
    })
};
exports.getUser = getUser;
// POST api/v1/users
const createUser = {
    body: Joi.object({
        username: _schemas_1.username().required(),
        email: _schemas_1.email().required(),
        password: _schemas_1.password('user').required()
    })
};
exports.createUser = createUser;
// PUT api/v1/users/:userId
const replaceUser = {
    params: Joi.object({
        userId: _schemas_1.id()
    }),
    body: Joi.object({
        username: _schemas_1.username().required(),
        email: _schemas_1.email().required(),
        password: _schemas_1.password('user').required()
    })
};
exports.replaceUser = replaceUser;
// PATCH api/v1/users/:userId
const updateUser = {
    params: Joi.object({
        userId: _schemas_1.id(),
    }),
    body: Joi.object({
        username: _schemas_1.username().required(),
        email: _schemas_1.email().required(),
        password: _schemas_1.password('user').required()
    })
};
exports.updateUser = updateUser;
// DELETE api/v1/users/:userId
const removeUser = {
    params: Joi.object({
        userId: _schemas_1.id()
    })
};
exports.removeUser = removeUser;
