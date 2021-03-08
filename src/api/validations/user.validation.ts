/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import * as Joi from 'joi';
import { ROLES } from '@enums/role.enum';
import { list } from '@utils/enum.util';

// GET api/v1/users
const listUsers = {
  query: Joi.object({
    page: Joi.number().min(1),
    perPage: Joi.number().min(1).max(100),
    username: Joi.string().max(32),
    email: Joi.string().email(),
    role: Joi.any().valid(...list(ROLES))
  })
};

// GET api/v1/users/userId
const getUser = {
  params: Joi.object({
    userId: Joi.string().regex(/^[0-9]{1,4}$/).required()
  })
};

// POST api/v1/users
const createUser = {
  body: Joi.object({
    username: Joi.string().max(32).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).required()
  })
};

// PUT api/v1/users/:userId
const replaceUser = {
  params: Joi.object({
    userId: Joi.string().regex(/^[0-9]{1,4}$/).required()
  }),
  body: Joi.object({
    username: Joi.string().max(32).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).required(),
  })
};

// PATCH api/v1/users/:userId
const updateUser = {
  params: Joi.object({
    userId: Joi.string().regex(/^[0-9]{1,4}$/).required(),
  }),
  body: Joi.object({
    username: Joi.string().max(32),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(16),
  })
};

// DELETE api/v1/users/:userId
const removeUser = {
  params: Joi.object({
    userId: Joi.string().regex(/^[0-9]{1,4}$/).required()
  })
};

export { listUsers, getUser, createUser, replaceUser, updateUser, removeUser };