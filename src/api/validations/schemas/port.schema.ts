import * as Joi from 'joi';
import { AnySchema } from 'joi';

const port = (): AnySchema => {
  return Joi.number().port();
};

export { port }
