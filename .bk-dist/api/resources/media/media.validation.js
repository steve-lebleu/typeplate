"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMedia = exports.updateMedia = exports.replaceMedia = exports.getMedia = exports.insertMedia = exports.listMedias = void 0;
const Joi = require("joi");
const _enums_1 = require("@enums");
const _schemas_1 = require("@schemas");
const enum_util_1 = require("@utils/enum.util");
// GET /v1/medias
const listMedias = {
    query: Joi.object({
        page: _schemas_1.pagination('page'),
        perPage: _schemas_1.pagination('perPage'),
        fieldname: _schemas_1.fieldname(),
        filename: _schemas_1.filename(false),
        path: _schemas_1.path(),
        mimetype: _schemas_1.mimetype(_enums_1.MIME_TYPE_LIST),
        size: Joi.number(),
        type: Joi.any().valid(...enum_util_1.list(_enums_1.MEDIA_TYPE)),
        owner: Joi.number()
    })
};
exports.listMedias = listMedias;
// POST /v1/medias
const insertMedia = {
    body: Joi.object({
        files: Joi.array().items(Joi.object().keys({
            fieldname: _schemas_1.fieldname().required(),
            filename: _schemas_1.filename().required(),
            path: _schemas_1.path().required(),
            mimetype: _schemas_1.mimetype(_enums_1.MIME_TYPE_LIST).required(),
            size: Joi.number().required(),
            owner: Joi.number().required(),
            url: Joi.string().required()
        }))
    })
};
exports.insertMedia = insertMedia;
// GET /v1/medias/:mediaId
const getMedia = {
    params: Joi.object({
        mediaId: _schemas_1.id()
    })
};
exports.getMedia = getMedia;
// PUT /v1/medias/:mediaId
const replaceMedia = {
    params: Joi.object({
        mediaId: _schemas_1.id()
    }),
    body: Joi.object({
        file: {
            fieldname: _schemas_1.fieldname().required(),
            filename: _schemas_1.filename().required(),
            path: _schemas_1.path().required(),
            mimetype: _schemas_1.mimetype(_enums_1.MIME_TYPE_LIST).required(),
            size: Joi.number().required(),
            owner: Joi.number().required(),
            url: Joi.string().required()
        }
    })
};
exports.replaceMedia = replaceMedia;
// PATCH /v1/medias/:mediaId
const updateMedia = {
    params: Joi.object({
        mediaId: _schemas_1.id()
    }),
    body: Joi.object({
        file: {
            fieldname: _schemas_1.fieldname(),
            filename: _schemas_1.filename(),
            path: _schemas_1.path(),
            mimetype: _schemas_1.mimetype(_enums_1.MIME_TYPE_LIST),
            size: Joi.number(),
            owner: Joi.number(),
            url: Joi.string()
        }
    })
};
exports.updateMedia = updateMedia;
// DELETE /v1/medias/:mediaId
const removeMedia = {
    params: Joi.object({
        mediaId: _schemas_1.id()
    })
};
exports.removeMedia = removeMedia;
