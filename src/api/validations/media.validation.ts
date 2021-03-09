/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import * as Joi from 'joi';

import { MIME_TYPE_LIST } from '@enums/mime-type.enum';
import { id, pagination, fieldname, filename, path, mimetype } from '@schemas';

// GET /v1/medias
const listMedias = {
  query: Joi.object({
    page: pagination('page'),
    perPage: pagination('perPage'),
    fieldname: fieldname(),
    filename: filename(false),
    path: path(),
    mimetype: mimetype(MIME_TYPE_LIST),
    size: Joi.number(),
    owner: Joi.number()
  })
};

// POST /v1/medias
const insertMedia = {
  body: Joi.object({
    files: Joi.array().items(
      Joi.object().keys({
        fieldname: fieldname().required(),
        filename: filename().required(),
        path: path().required(),
        mimetype: mimetype(MIME_TYPE_LIST).required(),
        size: Joi.number().required(),
        owner: Joi.number().required(),
        url: Joi.string().required()
      })
    )
  })
};

// GET /v1/medias/:mediaId
const getMedia = {
  params: Joi.object({
    mediaId: id()
  })
};

// PUT /v1/medias/:mediaId
const replaceMedia = {
  params: Joi.object({
    mediaId: id()
  }),
  body: Joi.object({
    file: {
      fieldname: fieldname().required(),
      filename: filename().required(),
      path: path().required(),
      mimetype: mimetype(MIME_TYPE_LIST).required(),
      size: Joi.number().required(),
      owner: Joi.number().required(),
      url: Joi.string().required()
    }
  })
};

// PATCH /v1/medias/:mediaId
const updateMedia = {
  params: Joi.object({
    mediaId: id()
  }),
  body: Joi.object({
    file: {
      fieldname:  fieldname(),
      filename: filename(),
      path: path(),
      mimetype: mimetype(MIME_TYPE_LIST),
      size: Joi.number(),
      owner: Joi.number(),
      url: Joi.string()
    }
  })
};

// DELETE /v1/medias/:mediaId
const removeMedia = {
  params: Joi.object({
    mediaId: id()
  })
};

export { listMedias, insertMedia, getMedia, replaceMedia, updateMedia, removeMedia };