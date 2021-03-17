import * as Joi from 'joi';
import { AnySchema } from 'joi';

const path = (): AnySchema => {
  return Joi.string().regex(/^[a-z-A-Z-0-9\-\_\/]{1,}\.[a-z-0-9]{1,5}$/i);
};

export { path }