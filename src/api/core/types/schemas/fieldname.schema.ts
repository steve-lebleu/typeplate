import * as Joi from 'joi';
import { AnySchema } from 'joi';

const fieldname = (): AnySchema => {
  return Joi.string().regex(/^[a-z\-]{1,24}$/i);
};

export { fieldname }