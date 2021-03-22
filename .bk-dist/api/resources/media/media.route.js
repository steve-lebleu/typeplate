"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaRouter = void 0;
const _classes_1 = require("@classes");
const guard_middleware_1 = require("@middlewares/guard.middleware");
const validator_middleware_1 = require("@middlewares/validator.middleware");
const uploader_middleware_1 = require("@middlewares/uploader.middleware");
const media_controller_1 = require("@controllers/media.controller");
const _enums_1 = require("@enums");
const media_validation_1 = require("@validations/media.validation");
class MediaRouter extends _classes_1.Router {
    constructor() {
        super();
    }
    /**
     * @description Plug routes definitions
     */
    define() {
        this.router.route('/')
            /**
             * @api {get} api/v1/medias List medias
             * @apiDescription Get a list of medias
             * @apiVersion 1.0.0
             * @apiName ListMedias
             * @apiGroup Media
             * @apiPermission admin
             *
             * @apiUse BaseHeader
             *
             * @apiParam  {Number{1-}}         [page=1]     List page
             * @apiParam  {Number{1-100}}      [perPage=1]  Medias's per page
             * @apiParam  {String}             [fieldname]  Medias's fieldname
             * @apiParam  {String}             [filename]   Medias's filename
             * @apiParam  {String}             [path]       Medias's path
             * @apiParam  {Number}             [size]       Medias's size
             * @apiParam  {String}             [mimetype]   Medias's mime type
             *
             * @apiSuccess {Medias[]}     media                Medias instance
             * @apiSuccess {Number}       media.id             Medias id
             * @apiSuccess {String}       media.fieldname      Medias fieldname
             * @apiSuccess {String}       media.filename       Medias filename
             * @apiSuccess {String}       media.path           Medias path
             * @apiSuccess {Number}       media.size           Medias file size
             * @apiSuccess {User}         media.owner          Medias owner user
             * @apiSuccess {Date}         media.createdAt      Medias creation date
             * @apiSuccess {Date}         media.updatedAt      Medias updating date
             *
             * @apiSuccessExample {json} Success response
             *  [
             *    {
             *      "id": 1,
             *      "fieldname": "cover",
             *      "filename": "javascript-1566722515926.jpg",
             *      "path": "/var/www/project/api/dist/uploads/images/master-copy/javascript-1566722515926.jpg",
             *      "mimetype": "image/jpeg",
             *      "size": 36118,
             *      "createdAt": "2019-08-23T08:49:00.000Z",
             *      "updatedAt": null
             *    },
             *    {
             *      "id": 2,
             *      "fieldname": "avatar",
             *      "filename": "picture-1566722515926.jpg",
             *      "path": "/var/www/project/api/dist/uploads/images/master-copy/picture-1566722515926.jpg",
             *      "mimetype": "image/jpeg",
             *      "size": 4789,
             *      "createdAt": "2019-08-23T08:49:00.000Z",
             *      "updatedAt": null
             *    }
             *  ]
             *
             * @apiError (Bad request 400)   ValidationError    Some parameters may contain invalid values
             * @apiError (Unauthorized 401)  Unauthorized       Only authenticated users can access the data
             * @apiError (Forbidden 403)     Forbidden          Only admins can access the data
             *
             * @apiErrorExample {json} ValidationError
             * {
             *    "statusCode": 400,
             *    "statusText": "Bad request",
             *    "errors": [
             *      {
             *        "field": "filename",
             *        "types": [
             *          "string.base"
             *        ],
             *        "messages": [
             *          "\"filename\" must be a string"
             *        ]
             *      }
             *    ]
             * }
             *
             * @apiErrorExample {json} Unauthorized
             * {
             *    "statusCode": 401,
             *    "statusText": "Unauthorized",
             *    "errors": [
             *      "Forbidden area"
             *    ]
             * }
             *
             * @apiErrorExample {json} Forbidden
             * {
             *    "statusCode": 403,
             *    "statusText": "Unauthorized",
             *    "errors": [
             *      "You can't access to this ressource"
             *    ]
             * }
             *
             */
            .get(guard_middleware_1.Guard.authorize([_enums_1.ROLE.admin, _enums_1.ROLE.user]), validator_middleware_1.Validator.check(media_validation_1.listMedias), media_controller_1.MediaController.list)
            /**
             * @api {post} api/v1/medias Create media(s)
             * @apiDescription Create one or many new media(s)
             * @apiVersion 1.0.0
             * @apiName CreateMedia
             * @apiGroup Media
             * @apiPermission user
             *
             * @apiUse MultipartHeader
             *
             * @apiParam {FormData} Files Uploaded file(s)
             *
             * @apiSuccess (Created 201) {Media[]}      media                Media instance
             * @apiSuccess (Created 201) {Number}       media.id             Media id
             * @apiSuccess (Created 201) {String}       media.fieldname      Media fieldname
             * @apiSuccess (Created 201) {String}       media.filename       Media filename
             * @apiSuccess (Created 201) {String}       media.path           Media path
             * @apiSuccess (Created 201) {Number}       media.size           Media file size
             * @apiSuccess (Created 201) {User}         media.owner          Media owner user
             * @apiSuccess (Created 201) {Date}         media.createdAt      Media creation date
             * @apiSuccess (Created 201) {Date}         media.updatedAt      Media updating date
             *
             * @apiSuccessExample {json} Success response
             *  [
             *    {
             *      "id": 1,
             *      "fieldname": "cover",
             *      "filename": "javascript-1566722515926.jpg",
             *      "path": "/var/www/project/api/dist/uploads/images/master-copy/javascript-1566722515926.jpg",
             *      "mimetype": "image/jpeg",
             *      "size": 36118,
             *      "createdAt": "2019-08-23T08:49:00.000Z",
             *      "updatedAt": null
             *    },
             *    {
             *      "id": 2,
             *      "fieldname": "avatar",
             *      "filename": "picture-1566722515926.jpg",
             *      "path": "/var/www/project/api/dist/uploads/images/master-copy/picture-1566722515926.jpg",
             *      "mimetype": "image/jpeg",
             *      "size": 4789,
             *      "createdAt": "2019-08-23T08:49:00.000Z",
             *      "updatedAt": null
             *    }
             *  ]
             *
             * @apiError (Bad request 400)    ValidationError   Some parameters may contain invalid values
             * @apiError (Forbidden 403)      Forbidden         Only authenticated users can insert the data
             *
             * @apiErrorExample {json} ValidationError
             * {
             *    "statusCode": 400,
             *    "statusText": "Bad request",
             *    "errors": [
             *      {
             *        "field": "filename",
             *        "types": [
             *          "string.base"
             *        ],
             *        "messages": [
             *          "\"filename\" must be a string"
             *        ]
             *      }
             *    ]
             * }
             *
             * @apiErrorExample {json} Forbidden
             * {
             *    "statusCode": 403,
             *    "statusText": "Unauthorized",
             *    "errors": [
             *      "You can't access to this ressource"
             *    ]
             * }
             *
             */
            .post(guard_middleware_1.Guard.authorize([_enums_1.ROLE.admin, _enums_1.ROLE.user]), uploader_middleware_1.Uploader.upload(), validator_middleware_1.Validator.check(media_validation_1.insertMedia), media_controller_1.MediaController.create);
        this.router.route('/:mediaId')
            /**
             * @api {get} api/v1/medias/:id Get one media
             * @apiDescription Get media
             * @apiVersion 1.0.0
             * @apiName GetMedia
             * @apiGroup Media
             * @apiPermission user
             *
             * @apiUse BaseHeader
             *
             * @apiSuccess {Media}     media                Media instance
             * @apiSuccess {Number}       media.id             Media id
             * @apiSuccess {String}       media.fieldname      Media fieldname
             * @apiSuccess {String}       media.filename       Media filename
             * @apiSuccess {String}       media.path           Media path
             * @apiSuccess {Number}       media.size           Media file size
             * @apiSuccess {User}         media.owner          Media owner user
             * @apiSuccess {Date}         media.createdAt      Media creation date
             * @apiSuccess {Date}         media.updatedAt      Media updating date
             *
             * @apiSuccessExample {json} Success response
             *    {
             *      "id": 1,
             *      "fieldname": "cover",
             *      "filename": "javascript-1566722515926.jpg",
             *      "path": "/var/www/project/api/dist/uploads/images/master-copy/javascript-1566722515926.jpg",
             *      "mimetype": "image/jpeg",
             *      "size": 36118,
             *      "createdAt": "2019-08-23T08:49:00.000Z",
             *      "updatedAt": null
             *    }
             *
             * @apiError (Bad request 400)   ValidationError    Some parameters may contain invalid values
             * @apiError (Unauthorized 401)  Unauthorized       Only authenticated users can access the data
             * @apiError (Forbidden 403)     Forbidden          Only admins can access the data
             * @apiError (Not Found 404)     NotFound           Media does not exist
             *
             * @apiErrorExample {json} ValidationError
             * {
             *    "statusCode": 400,
             *    "statusText": "Bad request",
             *    "errors": [
             *      {
             *        "field": "documentId",
             *        "types": [
             *          "string.base"
             *        ],
             *        "messages": [
             *          "\"documentId\" must be a number"
             *        ]
             *      }
             *    ]
             * }
             *
             * @apiErrorExample {json} Unauthorized
             * {
             *    "statusCode": 401,
             *    "statusText": "Unauthorized",
             *    "errors": [
             *      "Forbidden area"
             *    ]
             * }
             *
             * @apiErrorExample {json} Forbidden
             * {
             *    "statusCode": 403,
             *    "statusText": "Unauthorized",
             *    "errors": [
             *      "You can't access to this ressource"
             *    ]
             * }
             *
             * @apiErrorExample {json} NotFound
             * {
             *    "statusCode": 404,
             *    "statusText": "Not found",
             *    "errors": [
             *      "Media not found"
             *    ]
             * }
             */
            .get(guard_middleware_1.Guard.authorize([_enums_1.ROLE.admin, _enums_1.ROLE.user]), validator_middleware_1.Validator.check(media_validation_1.getMedia), media_controller_1.MediaController.get)
            /**
             * @api {put} api/v1/medias/:id Replace media
             * @apiDescription Replace the whole media with a new one
             * @apiVersion 1.0.0
             * @apiName ReplaceDocument
             * @apiGroup Media
             * @apiPermission user
             *
             * @apiUse MultipartHeader
             *
             * @apiSuccess {Media}     media                Media instance
             * @apiSuccess {Number}       media.id             Media id
             * @apiSuccess {String}       media.fieldname      Media fieldname
             * @apiSuccess {String}       media.filename       Media filename
             * @apiSuccess {String}       media.path           Media path
             * @apiSuccess {Number}       media.size           Media file size
             * @apiSuccess {User}         media.owner          Media owner user
             * @apiSuccess {Date}         media.createdAt      Media creation date
             * @apiSuccess {Date}         media.updatedAt      Media updating date
             *
             * @apiSuccessExample {json} Success response
             *    {
             *      "id": 1,
             *      "fieldname": "cover",
             *      "filename": "javascript-1566722515926.jpg",
             *      "path": "/var/www/project/api/dist/uploads/images/master-copy/javascript-1566722515926.jpg",
             *      "mimetype": "image/jpeg",
             *      "size": 36118,
             *      "createdAt": "2019-08-23T08:49:00.000Z",
             *      "updatedAt": null
             *    }
             *
             * @apiError (Bad request 400)   ValidationError    Some parameters may contain invalid values
             * @apiError (Unauthorized 401)  Unauthorized       Only authenticated users can access the data
             * @apiError (Forbidden 403)     Forbidden          Only admins can access the data
             * @apiError (Not Found 404)     NotFound           Media does not exist
             *
             * @apiErrorExample {json} ValidationError
             * {
             *    "statusCode": 400,
             *    "statusText": "Bad request",
             *    "errors": [
             *      {
             *        "field": "documentId",
             *        "types": [
             *          "string.base"
             *        ],
             *        "messages": [
             *          "\"documentId\" must be a number"
             *        ]
             *      }
             *    ]
             * }
             *
             * @apiErrorExample {json} Unauthorized
             * {
             *    "statusCode": 401,
             *    "statusText": "Unauthorized",
             *    "errors": [
             *      "Forbidden area"
             *    ]
             * }
             *
             * @apiErrorExample {json} Forbidden
             * {
             *    "statusCode": 403,
             *    "statusText": "Unauthorized",
             *    "errors": [
             *      "You can't access to this ressource"
             *    ]
             * }
             *
             * @apiErrorExample {json} NotFound
             * {
             *    "statusCode": 404,
             *    "statusText": "Not found",
             *    "errors": [
             *      "Media not found"
             *    ]
             * }
             */
            .put(guard_middleware_1.Guard.authorize([_enums_1.ROLE.admin, _enums_1.ROLE.user]), validator_middleware_1.Validator.check(media_validation_1.replaceMedia), media_controller_1.MediaController.get, uploader_middleware_1.Uploader.upload(), validator_middleware_1.Validator.check(media_validation_1.insertMedia), media_controller_1.MediaController.update)
            /**
             * @api {patch} api/v1/medias/:id Update media
             * @apiDescription Update some fields of a media
             * @apiVersion 1.0.0
             * @apiName UpdateDocument
             * @apiGroup Media
             * @apiPermission user
             *
             * @apiUse MultipartHeader
             *
             * @apiSuccess {Media}     media                Media instance
             * @apiSuccess {Number}       media.id             Media id
             * @apiSuccess {String}       media.fieldname      Media fieldname
             * @apiSuccess {String}       media.filename       Media filename
             * @apiSuccess {String}       media.path           Media path
             * @apiSuccess {Number}       media.size           Media file size
             * @apiSuccess {User}         media.owner          Media owner user
             * @apiSuccess {Date}         media.createdAt      Media creation date
             * @apiSuccess {Date}         media.updatedAt      Media updating date
             *
             * @apiSuccessExample {json} Success response
             *    {
             *      "id": 1,
             *      "fieldname": "cover",
             *      "filename": "javascript-1566722515926.jpg",
             *      "path": "/var/www/project/api/dist/uploads/images/master-copy/javascript-1566722515926.jpg",
             *      "mimetype": "image/jpeg",
             *      "size": 36118,
             *      "createdAt": "2019-08-23T08:49:00.000Z",
             *      "updatedAt": null
             *    }
             *
             * @apiError (Bad request 400)   ValidationError    Some parameters may contain invalid values
             * @apiError (Unauthorized 401)  Unauthorized       Only authenticated users can access the data
             * @apiError (Forbidden 403)     Forbidden          Only admins can access the data
             * @apiError (Not Found 404)     NotFound           Media does not exist
             *
             * @apiErrorExample {json} ValidationError
             * {
             *    "statusCode": 400,
             *    "statusText": "Bad request",
             *    "errors": [
             *      {
             *        "field": "documentId",
             *        "types": [
             *          "string.base"
             *        ],
             *        "messages": [
             *          "\"documentId\" must be a number"
             *        ]
             *      }
             *    ]
             * }
             *
             * @apiErrorExample {json} Unauthorized
             * {
             *    "statusCode": 401,
             *    "statusText": "Unauthorized",
             *    "errors": [
             *      "Forbidden area"
             *    ]
             * }
             *
             * @apiErrorExample {json} Forbidden
             * {
             *    "statusCode": 403,
             *    "statusText": "Unauthorized",
             *    "errors": [
             *      "You can't access to this ressource"
             *    ]
             * }
             *
             * @apiErrorExample {json} NotFound
             * {
             *    "statusCode": 404,
             *    "statusText": "Not found",
             *    "errors": [
             *      "Media not found"
             *    ]
             * }
             */
            .patch(guard_middleware_1.Guard.authorize([_enums_1.ROLE.admin, _enums_1.ROLE.user]), validator_middleware_1.Validator.check(media_validation_1.updateMedia), media_controller_1.MediaController.get, uploader_middleware_1.Uploader.upload(), media_controller_1.MediaController.update)
            /**
             * @api {patch} api/v1/medias/:id Delete media
             * @apiDescription Delete a media
             * @apiVersion 1.0.0
             * @apiName DeleteDocument
             * @apiGroup Media
             * @apiPermission user
             *
             * @apiUse BaseHeader
             *
             * @apiError (Bad request 400)   ValidationError    Some parameters may contain invalid values
             * @apiError (Unauthorized 401)  Unauthorized       Only authenticated users can access the data
             * @apiError (Forbidden 403)     Forbidden          Only admins can access the data
             * @apiError (Not Found 404)     NotFound           Media does not exist
             *
             * @apiErrorExample {json} ValidationError
             * {
             *    "statusCode": 400,
             *    "statusText": "Bad request",
             *    "errors": [
             *      {
             *        "field": "documentId",
             *        "types": [
             *          "string.base"
             *        ],
             *        "messages": [
             *          "\"documentId\" must be a number"
             *        ]
             *      }
             *    ]
             * }
             *
             * @apiErrorExample {json} Unauthorized
             * {
             *    "statusCode": 401,
             *    "statusText": "Unauthorized",
             *    "errors": [
             *      "Forbidden area"
             *    ]
             * }
             *
             * @apiErrorExample {json} Forbidden
             * {
             *    "statusCode": 403,
             *    "statusText": "Unauthorized",
             *    "errors": [
             *      "You can't access to this ressource"
             *    ]
             * }
             *
             * @apiErrorExample {json} NotFound
             * {
             *    "statusCode": 404,
             *    "statusText": "Not found",
             *    "errors": [
             *      "Media not found"
             *    ]
             * }
             */
            .delete(guard_middleware_1.Guard.authorize([_enums_1.ROLE.admin, _enums_1.ROLE.user]), validator_middleware_1.Validator.check(media_validation_1.removeMedia), media_controller_1.MediaController.get, media_controller_1.MediaController.remove);
    }
}
exports.MediaRouter = MediaRouter;
