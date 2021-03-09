import * as Joi from 'joi';
import { AnySchema } from 'joi';

const filename = (extension: boolean = true): AnySchema => {
  return extension ? Joi.string().regex(/^[a-z-A-Z-0-9\-\_]{1,123}\.[a-z-0-9]{1,5}$/i) : Joi.string().regex(/^[a-z-A-Z-0-9\-\_\w]{1,123}$/i);
};

export { filename }