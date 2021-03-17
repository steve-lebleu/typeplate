import * as Joi from 'joi';
import { AnySchema } from 'joi';

const host = (type: string): AnySchema => {
  const types = [
    {
      type: 'smtp',
      schema: Joi.string().regex(/^[a-z-0-9\-]{2,12}\.[a-z]{2,16}\.[a-z]{2,8}$/i)
    }
  ];
  return types.filter( h => h.type === type ).slice().shift().schema;
};

export { host }