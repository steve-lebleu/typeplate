import * as Joi from 'joi';

export const host = (type) => {
  const types = [
    {
      type: 'smtp',
      schema: Joi.string().regex(/^[a-z-0-9\-]{2,12}\.[a-z]{2,16}\.[a-z]{2,8}$/i)
    }
  ];
  return types.filter( host => host.type === type ).slice().shift().schema;
};

export const pagination = (filter) => {
  const filters = {
    page: Joi.number().min(1),
    perPage: Joi.number().min(1).max(100)
  };
  return filters[filter];
};

export const name = () => {
  return Joi.string().max(32);
};

export const port = () => {
  return Joi.number().port();
};

export const username = (type) => {
  const types = [
    {
      type: 'smtp',
      schema: Joi.string().min(4).max(64)
    }
  ];
  return types.filter( username => username.type === type ).slice().shift().schema;
};

export const password = (type) => {
  const types = [
    {
      type: 'smtp',
      schema: Joi.string().min(8).max(128)
    }
  ];
  return types.filter( password => password.type === type ).slice().shift().schema;
};

export const id = () => {
  return Joi.string().regex(/^[0-9]{1,4}$/).required();
};

export const fieldname = () => {
  return Joi.string().regex(/^[a-z\-]{1,24}$/i);
};

export const filename = () => {
  return Joi.string().regex(/^[a-z-A-Z-0-9\-\_]{1,123}\.[a-z-0-9]{1,5}$/i);
};

export const path = () => {
  return Joi.string().regex(/^[a-z-A-Z-0-9\-\_\/]{1,}\.[a-z-0-9]{1,5}$/i);
};

export const mimetype = (mimetypes) => {
  return Joi.string().valid(mimetypes);
};