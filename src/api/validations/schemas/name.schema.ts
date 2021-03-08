import * as Joi from 'joi';
import { AnySchema } from 'joi';

const name = (): AnySchema => {
  return Joi.string().max(32);
};

export { name }
