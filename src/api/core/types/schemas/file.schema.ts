import * as Joi from 'joi';
import { AnySchema } from 'joi';

import { MIME_TYPE_LIST } from '@enums';
import { filename, path, mimetype } from '@schemas';
import { Fieldname } from '@types';

const file = (field_name: Fieldname): AnySchema => {
  return Joi.object().keys({
    fieldname: Joi.string().valid(field_name).required(),
    filename: filename().required(),
    path: path().required(),
    mimetype: mimetype(MIME_TYPE_LIST).required(),
    size: Joi.number().required(),
    owner: Joi.number().required()
  });
};

export { file }