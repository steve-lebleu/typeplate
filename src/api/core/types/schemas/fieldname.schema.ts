import * as Joi from 'joi';
import { AnySchema } from 'joi';

import { list } from '@utils/enum.util';
import { FIELDNAME } from '@enums';

const fieldname = (): AnySchema => {
  return Joi.any().valid(...list(FIELDNAME));
};

export { fieldname }