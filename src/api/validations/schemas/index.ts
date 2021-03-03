/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import * as Joi from 'joi';
import { AnySchema } from 'joi';

export const host = (type: string): AnySchema => {
  const types = [
    {
      type: 'smtp',
      schema: Joi.string().regex(/^[a-z-0-9\-]{2,12}\.[a-z]{2,16}\.[a-z]{2,8}$/i)
    }
  ];
  return types.filter( h => h.type === type ).slice().shift().schema;
};

export const pagination = (filter: string): AnySchema => {
  const filters = {
    page: Joi.number().min(1),
    perPage: Joi.number().min(1).max(100)
  };
  return filters[filter];
};

export const name = (): AnySchema => {
  return Joi.string().max(32);
};

export const port = (): AnySchema => {
  return Joi.number().port();
};

export const username = (type: string): AnySchema => {
  const types = [
    {
      type: 'smtp',
      schema: Joi.string().min(4).max(64)
    }
  ];
  return types.filter( u => u.type === type ).slice().shift().schema;
};

export const password = (type: string): AnySchema => {
  const types = [
    {
      type: 'smtp',
      schema: Joi.string().min(8).max(128)
    }
  ];
  return types.filter( p => p.type === type ).slice().shift().schema;
};

export const id = (): AnySchema => {
  return Joi.string().regex(/^[0-9]{1,4}$/).required();
};

export const fieldname = (): AnySchema => {
  return Joi.string().regex(/^[a-z\-]{1,24}$/i);
};

export const filename = (): AnySchema => {
  return Joi.string().regex(/^[a-z-A-Z-0-9\-\_]{1,123}\.[a-z-0-9]{1,5}$/i);
};

export const path = (): AnySchema => {
  return Joi.string().regex(/^[a-z-A-Z-0-9\-\_\/]{1,}\.[a-z-0-9]{1,5}$/i);
};

export const mimetype = (mimetypes: string[]): AnySchema => {
  return Joi.string().valid(mimetypes);
};