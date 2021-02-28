import * as Joi from 'joi';
import * as schemas from '@validations/schemas';
import { UPLOAD_MIME_TYPE } from '@enums/mime-type.enum';

const schemaDocuments = () => {
  return Joi.array().items(
    Joi.object().keys({
      fieldname: schemas.fieldname().required(),
      filename: schemas.filename().required(),
      path: schemas.path().required(),
      mimetype: schemas.mimetype(UPLOAD_MIME_TYPE).required(),
      size: Joi.number().required(),
      owner: Joi.number().required()
    })
  )
};

// GET /v1/documents
const listDocuments = {
  query: {
    page: schemas.pagination('page'),
    perPage: schemas.pagination('perPage'),
    fieldname: schemas.fieldname(),
    filename: Joi.string().regex(/^[a-z-A-Z-0-9\-\_\w]{1,123}$/i),
    path: schemas.path(),
    mimetype: schemas.mimetype(UPLOAD_MIME_TYPE),
    size: Joi.number(),
    owner: Joi.number()
  }
};

// POST /v1/documents
const insertDocument = {
  body: {
    files: schemaDocuments()
  }
};

// GET /v1/documents/:documentId
const getDocument = {
  params: {
    documentId: schemas.id()
  }
};

// PUT /v1/documents/:documentId
const replaceDocument = {
  params: {
    documentId: schemas.id()
  },
  body: {
    file: {
      fieldname: schemas.fieldname().required(),
      filename: schemas.filename().required(),
      path: schemas.path().required(),
      mimetype: schemas.mimetype(UPLOAD_MIME_TYPE).required(),
      size: Joi.number().required(),
      owner: Joi.number().required()
    }
  }
};

// PATCH /v1/documents/:documentId
const updateDocument = {
  params: {
    documentId: schemas.id()
  },
  body: {
    file: {
      fieldname: schemas.fieldname(),
      filename: schemas.filename(),
      path: schemas.path(),
      mimetype: schemas.mimetype(UPLOAD_MIME_TYPE),
      size: Joi.number(),
      owner: Joi.number()
    }
  }
};

// DELETE /v1/documents/:documentId
const removeDocument = {
  params: {
    documentId: schemas.id()
  }
};

export { listDocuments, insertDocument, getDocument, replaceDocument, updateDocument, removeDocument };