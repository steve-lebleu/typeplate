/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import * as Joi from 'joi';
import { ROLE, FIELDNAME, STATUS } from '@enums';
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
    status: Joi.any().valid(...list(STATUS)),
    website: Joi.string().uri()
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
    password: password('user').required(),
    status: Joi.any().valid(...list(STATUS)).optional(),
    avatar: file( FIELDNAME.avatar ).allow(null),
    role: Joi.any().valid(...list(ROLE))
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
    status: Joi.any().valid(...list(STATUS)).required(),
    avatar: file( FIELDNAME.avatar ).allow(null),
    role: Joi.any().valid(...list(ROLE)).required()
  })
};

// PATCH api/v1/users/:userId
const updateUser = {
  params: Joi.object({
    userId: id(),
  }),
  body: Joi.object({
    username: username(),
    email: email(),
    isUpdatePassword: Joi.boolean().optional(),
    password: password('user'),
    passwordConfirmation: Joi.when('password', {
      is: password('user').required(),
      then: Joi.any().equal( Joi.ref('password') ).required().label('Confirm password').messages({ 'any.only': '{{#label}} does not match' }),
      otherwise: Joi.optional()
    }),
    passwordToRevoke: Joi.when('isUpdatePassword', {
      is: Joi.any().equal(true).required(),
      then: password('user').required(),
      otherwise: Joi.optional()
    }),
    status: Joi.any().valid(...list(STATUS)).optional(),
    avatar: file( FIELDNAME.avatar ).allow(null),
    role: Joi.any().valid(...list(ROLE))
  })
};

// DELETE api/v1/users/:userId
const removeUser = {
  params: Joi.object({
    userId: id()
  })
};

export { listUsers, getUser, createUser, replaceUser, updateUser, removeUser };