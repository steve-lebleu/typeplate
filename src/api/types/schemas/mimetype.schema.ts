import * as Joi from 'joi';
import { AnySchema } from 'joi';

const mimetype = (mimetypes: string[]): AnySchema => {
  return Joi.any().valid(...mimetypes);
};

export { mimetype }