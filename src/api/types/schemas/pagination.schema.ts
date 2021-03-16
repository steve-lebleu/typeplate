import * as Joi from 'joi';
import { AnySchema } from 'joi';

const pagination = (filter: string): AnySchema => {
  const filters = {
    page: Joi.number().min(1),
    perPage: Joi.number().min(1).max(100)
  };
  return filters[filter] as AnySchema;
};

export { pagination }