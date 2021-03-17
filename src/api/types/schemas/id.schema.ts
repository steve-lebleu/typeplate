import * as Joi from 'joi';
import { AnySchema } from 'joi';

const id = (): AnySchema => {
  return Joi.string().regex(/^[0-9]{1,4}$/).required();
};

export { id }