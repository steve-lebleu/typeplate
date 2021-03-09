import * as Joi from 'joi';
import { AnySchema } from 'joi';

const username = (): AnySchema => {
  return Joi.string().max(32);
};

export { username }