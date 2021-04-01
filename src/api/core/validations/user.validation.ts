/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import * as Joi from 'joi';
import { ROLE, FIELDNAME } from '@enums';
import { list } from '@utils/enum.util';

import { email, id, pagination, username, password, file } from '@schemas';

// GET api/v1/users
const listUsers = {
  query: Joi.object({
    page: pagination('page'),
    perPage: pagination('perPage'),
    username: username(),
    email: email(),
    role: Joi.any().valid(...list(ROLE)),
    confirmed: Joi.boolean()
  })
};

// GET api/v1/users/userId
const getUser = {
  params: Joi.object({
    userId: id()
  })
};

// POST api/v1/users
const createUser = {
  body: Joi.object({
    username: username().required(),
    email: email().required(),
    password: password('user').required()
  })
};

// PUT api/v1/users/:userId
const replaceUser = {
  params: Joi.object({
    userId: id()
  }),
  body: Joi.object({
    username: username().required(),
    email: email().required(),
    password: password('user').required(),
    files: Joi.array().items( file( FIELDNAME.avatar ) ).max(1).optional()
  })
};

// PATCH api/v1/users/:userId
const updateUser = {
  params: Joi.object({
    userId: id(),
  }),
  body: Joi.object({
    username: username().required(),
    email: email().required(),
    password: password('user').required(),
    files: Joi.array().items( file( FIELDNAME.avatar ) ).max(1).optional()
  })
};

// DELETE api/v1/users/:userId
const removeUser = {
  params: Joi.object({
    userId: id()
  })
};

export { listUsers, getUser, createUser, replaceUser, updateUser, removeUser };