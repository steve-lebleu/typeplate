/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import * as Joi from 'joi';

// POST api/v1/auth/register
const register = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).required()
  })
};

// POST api/v1/auth/login
const login = {
  body: Joi.object({
    email: Joi.when('context.apikey', {
      is: null,
      then: Joi.string().email().required(),
      otherwise: Joi.optional()
    }),
    password: Joi.when('context.apikey', {
      is: null,
      then: Joi.string().min(8).max(16).required(),
      otherwise: Joi.optional()
    }),
    apikey: Joi.when('context.password', {
      is: null,
      then: Joi.string().length(64).required(),
      otherwise: Joi.optional()
    })
  })
};

// POST api/v1/auth/facebook
// POST api/v1/auth/google
const oAuth = {
  body: Joi.object({
    access_token: Joi.string().required(),
  })
};

// POST api/v1/auth/refresh
const refresh = {
  body: Joi.object({
    token: Joi.object().keys({
      refreshToken: Joi.string().min(82).max(88).required(),
    }).required()
  })
};

export { register, login, oAuth, refresh };