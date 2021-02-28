import { getRepository } from 'typeorm';
import { Container } from '@config/container.config';
import { Router } from '@bases/router.class';
import { Guard, ADMIN, LOGGED_USER } from '@middlewares/guard.middleware';
import { Validator } from '@middlewares/validator.middleware';
import { Uploader } from '@middlewares/uploader.middleware';

import { listDocuments, insertDocument, getDocument, replaceDocument, updateDocument, removeDocument } from '@validations/document.validation';

export class DocumentRouter extends Router {

  constructor(){
 super();
}

  /**
   * @description Plug routes definitions
   */
  define(): void {

    this.router.route('/')

      /**
       * @api {get} api/v1/documents List documents
       * @apiDescription Get a list of documents
       * @apiVersion 1.0.0
       * @apiName Listdocuments
       * @apiGroup Document
       * @apiPermission admin
       *
       * @apiUse BaseHeader
       *
       * @apiParam  {Number{1-}}         [page=1]     List page
       * @apiParam  {Number{1-100}}      [perPage=1]  Document's per page
       * @apiParam  {String}             [fieldname]  Document's fieldname
       * @apiParam  {String}             [filename]   Document's filename
       * @apiParam  {String}             [path]       Document's path
       * @apiParam  {Number}             [size]       Document's size
       * @apiParam  {String}             [mimetype]   Document's mime type
       *
       * @apiSuccess {Document[]}   document                Document instance
       * @apiSuccess {Number}       document.id             Document id
       * @apiSuccess {String}       document.fieldname      Document fieldname
       * @apiSuccess {String}       document.filename       Document filename
       * @apiSuccess {String}       document.path           Document path
       * @apiSuccess {Number}       document.size           Document file size
       * @apiSuccess {User}         document.owner          Document owner user
       * @apiSuccess {Date}         document.createdAt      Document creation date
       * @apiSuccess {Date}         document.updatedAt      Document updating date
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
      .get(Guard.authorize([ADMIN, LOGGED_USER]), Validator.validate(listDocuments), Container.resolve('DocumentController').list)

      /**
       * @api {post} api/v1/documents Create document(s)
       * @apiDescription Create one or many new document(s)
       * @apiVersion 1.0.0
       * @apiName CreateDocument
       * @apiGroup Document
       * @apiPermission user
       *
       * @apiUse MultipartHeader
       *
       * @apiParam {FormData} Files Uploaded file(s)
       *
       * @apiSuccess (Created 201) {Document[]}   document                Document instance
       * @apiSuccess (Created 201) {Number}       document.id             Document id
       * @apiSuccess (Created 201) {String}       document.fieldname      Document fieldname
       * @apiSuccess (Created 201) {String}       document.filename       Document filename
       * @apiSuccess (Created 201) {String}       document.path           Document path
       * @apiSuccess (Created 201) {Number}       document.size           Document file size
       * @apiSuccess (Created 201) {User}         document.owner          Document owner user
       * @apiSuccess (Created 201) {Date}         document.createdAt      Document creation date
       * @apiSuccess (Created 201) {Date}         document.updatedAt      Document updating date
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
      .post(Guard.authorize([ADMIN, LOGGED_USER]), Uploader.uploadMultiple(), Uploader.resize, Validator.validate(insertDocument), Container.resolve('DocumentController').create);

    this.router.route('/:documentId')

      /**
       * @api {get} api/v1/documents/:id Get one document
       * @apiDescription Get document
       * @apiVersion 1.0.0
       * @apiName GetDocument
       * @apiGroup Document
       * @apiPermission user
       *
       * @apiUse BaseHeader
       *
       * @apiSuccess {Document}     document                Document instance
       * @apiSuccess {Number}       document.id             Document id
       * @apiSuccess {String}       document.fieldname      Document fieldname
       * @apiSuccess {String}       document.filename       Document filename
       * @apiSuccess {String}       document.path           Document path
       * @apiSuccess {Number}       document.size           Document file size
       * @apiSuccess {User}         document.owner          Document owner user
       * @apiSuccess {Date}         document.createdAt      Document creation date
       * @apiSuccess {Date}         document.updatedAt      Document updating date
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
       * @apiError (Not Found 404)     NotFound           Document does not exist
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
       *      "Document not found"
       *    ]
       * }
       */
      .get(Guard.authorize([ADMIN, LOGGED_USER]), Validator.validate(getDocument), Container.resolve('DocumentController').get)

      /**
       * @api {put} api/v1/documents/:id Replace document
       * @apiDescription Replace the whole document with a new one
       * @apiVersion 1.0.0
       * @apiName ReplaceDocument
       * @apiGroup Document
       * @apiPermission user
       *
       * @apiUse MultipartHeader
       *
       * @apiSuccess {Document}     document                Document instance
       * @apiSuccess {Number}       document.id             Document id
       * @apiSuccess {String}       document.fieldname      Document fieldname
       * @apiSuccess {String}       document.filename       Document filename
       * @apiSuccess {String}       document.path           Document path
       * @apiSuccess {Number}       document.size           Document file size
       * @apiSuccess {User}         document.owner          Document owner user
       * @apiSuccess {Date}         document.createdAt      Document creation date
       * @apiSuccess {Date}         document.updatedAt      Document updating date
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
       * @apiError (Not Found 404)     NotFound           Document does not exist
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
       *      "Document not found"
       *    ]
       * }
       */
      .put(Guard.authorize([ADMIN, LOGGED_USER]), Validator.validate(replaceDocument), Container.resolve('DocumentController').get, Uploader.upload(), Uploader.resize, Validator.validate(insertDocument), Container.resolve('DocumentController').update)

      /**
       * @api {patch} api/v1/documents/:id Update document
       * @apiDescription Update some fields of a document
       * @apiVersion 1.0.0
       * @apiName UpdateDocument
       * @apiGroup Document
       * @apiPermission user
       *
       * @apiUse MultipartHeader
       *
       * @apiSuccess {Document}     document                Document instance
       * @apiSuccess {Number}       document.id             Document id
       * @apiSuccess {String}       document.fieldname      Document fieldname
       * @apiSuccess {String}       document.filename       Document filename
       * @apiSuccess {String}       document.path           Document path
       * @apiSuccess {Number}       document.size           Document file size
       * @apiSuccess {User}         document.owner          Document owner user
       * @apiSuccess {Date}         document.createdAt      Document creation date
       * @apiSuccess {Date}         document.updatedAt      Document updating date
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
       * @apiError (Not Found 404)     NotFound           Document does not exist
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
       *      "Document not found"
       *    ]
       * }
       */
      .patch(Guard.authorize([ADMIN, LOGGED_USER]), Validator.validate(updateDocument), Container.resolve('DocumentController').get, Uploader.upload(), Uploader.resize, Container.resolve('DocumentController').update)

      /**
       * @api {patch} api/v1/documents/:id Delete document
       * @apiDescription Delete a document
       * @apiVersion 1.0.0
       * @apiName DeleteDocument
       * @apiGroup Document
       * @apiPermission user
       *
       * @apiUse BaseHeader
       *
       * @apiError (Bad request 400)   ValidationError    Some parameters may contain invalid values
       * @apiError (Unauthorized 401)  Unauthorized       Only authenticated users can access the data
       * @apiError (Forbidden 403)     Forbidden          Only admins can access the data
       * @apiError (Not Found 404)     NotFound           Document does not exist
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
       *      "Document not found"
       *    ]
       * }
       */
      .delete(Guard.authorize([ADMIN, LOGGED_USER]), Validator.validate(removeDocument), Container.resolve('DocumentController').remove);

  }
}