/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import * as Joi from 'joi';
import * as schemas from '@validations/schemas';
import { MIME_TYPE_LIST } from '@enums/mime-type.enum';

const schemaMedias = () => {
  return Joi.array().items(
    Joi.object().keys({
      fieldname: schemas.fieldname().required(),
      filename: schemas.filename().required(),
      path: schemas.path().required(),
      mimetype: schemas.mimetype(MIME_TYPE_LIST).required(),
      size: Joi.number().required(),
      owner: Joi.number().required()
    })
  )
};

// GET /v1/medias
const listMedias = {
  query: {
    page: schemas.pagination('page'),
    perPage: schemas.pagination('perPage'),
    fieldname: schemas.fieldname(),
    filename: Joi.string().regex(/^[a-z-A-Z-0-9\-\_\w]{1,123}$/i),
    path: schemas.path(),
    mimetype: schemas.mimetype(MIME_TYPE_LIST),
    size: Joi.number(),
    owner: Joi.number()
  }
};

// POST /v1/medias
const insertMedia = {
  body: {
    files: schemaMedias()
  }
};

// GET /v1/medias/:mediaId
const getMedia = {
  params: {
    mediaId: schemas.id()
  }
};

// PUT /v1/medias/:mediaId
const replaceMedia = {
  params: {
    mediaId: schemas.id()
  },
  body: {
    file: {
      fieldname: schemas.fieldname().required(),
      filename: schemas.filename().required(),
      path: schemas.path().required(),
      mimetype: schemas.mimetype(MIME_TYPE_LIST).required(),
      size: Joi.number().required(),
      owner: Joi.number().required()
    }
  }
};

// PATCH /v1/medias/:mediaId
const updateMedia = {
  params: {
    mediaId: schemas.id()
  },
  body: {
    file: {
      fieldname: schemas.fieldname(),
      filename: schemas.filename(),
      path: schemas.path(),
      mimetype: schemas.mimetype(MIME_TYPE_LIST),
      size: Joi.number(),
      owner: Joi.number()
    }
  }
};

// DELETE /v1/medias/:mediaId
const removeMedia = {
  params: {
    mediaId: schemas.id()
  }
};

export { listMedias, insertMedia, getMedia, replaceMedia, updateMedia, removeMedia };