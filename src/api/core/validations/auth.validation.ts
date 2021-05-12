/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import * as Joi from 'joi';

import { email, password, username } from '@schemas';

// POST api/v1/auth/register
const register = {
  body: Joi.object({
    username: username(),
    email: email().required(),
    password: password('user').required()
  })
};

// POST api/v1/auth/login
const login = {
  body: Joi.object({
    email: Joi.when('context.apikey', {
      is: null,
      then: email().required(),
      otherwise: Joi.optional()
    }),
    password: Joi.when('context.apikey', {
      is: null,
      then: password('user').required(),
      otherwise: Joi.optional()
    }),
    apikey: Joi.when('context.password', {
      is: null,
      then: Joi.string().length(64).required(),
      otherwise: Joi.optional()
    }),
    refreshToken: Joi.string()
  })
};

// POST api/v1/auth/refresh
const refresh = {
  body: Joi.object({
    token: Joi.object().keys({
      refreshToken: Joi.string().required(),
    }).required()
  })
};

// GEET api/v1/auth/:service/callback
const oauthCb = {
  query: Joi.object({
    code: Joi.string().required(),
  })
};

// PATCH api/v1/auth/confirm
const confirm = {
  body: Joi.object({
    token: Joi.string().min(64).required()
  })
};

// GET api/v1/auth/request-password
const requestPassword = {
  query: Joi.object({
    email: Joi.string().email().required()
  })
};


export { register, login, refresh, oauthCb, confirm, requestPassword };