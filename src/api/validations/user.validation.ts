import * as Joi from "joi";
import { ROLE } from "@enums/role.enum";
import { list } from "@utils/enum.util";

// GET api/v1/users
const listUsers = {
  query: {
    page: Joi.number().min(1),
    perPage: Joi.number().min(1).max(100),
    username: Joi.string().max(32),
    email: Joi.string().email({ minDomainAtoms: 2 }),
    role: Joi.string().valid(list(ROLE))
  }
};

// GET api/v1/users/userId
const getUser = {
  params: {
    userId: Joi.string().regex(/^[0-9]{1,4}$/).required()
  }
};

// POST api/v1/users
const createUser = {
  body: {
    username: Joi.string().max(32).required(), 
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().min(8).max(16).required()
  }
};

// PUT api/v1/users/:userId
const replaceUser = {
  params: {
    userId: Joi.string().regex(/^[0-9]{1,4}$/).required()
  },
  body: {
    username: Joi.string().max(32).required(), 
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().min(8).max(16).required(),
  }
};

// PATCH api/v1/users/:userId
const updateUser = {
  params: {
    userId: Joi.string().regex(/^[0-9]{1,4}$/).required(),
  },
  body: {
    username: Joi.string().max(32), 
    email: Joi.string().email({ minDomainAtoms: 2 }),
    password: Joi.string().min(8).max(16),
  }
};

// DELETE api/v1/users/:userId
const removeUser = {
  params: {
    userId: Joi.string().regex(/^[0-9]{1,4}$/).required()
  }
};

export { listUsers, getUser, createUser, replaceUser, updateUser, removeUser };