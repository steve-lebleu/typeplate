import { Router } from '@classes';
import { Guard } from '@middlewares/guard.middleware';
import { Validator } from '@middlewares/validator.middleware';
import { Uploader } from '@middlewares/uploader.middleware';
import { MediaController } from '@controllers/media.controller';
import { ROLE, MIME_TYPE } from '@enums';
import { list } from '@utils/enum.util';
import { listMedias, insertMedia, getMedia, replaceMedia, updateMedia, removeMedia } from '@validations/media.validation';

export class MediaRouter extends Router {

  constructor(){
    super();
  }

  /**
   * @description Plug routes definitions
   */
  define(): void {

    this.router.route('/')

      /**
       * @api {get} /medias List medias
       * @apiDescription Get a list of medias
       * @apiVersion 1.0.0
       * @apiName ListMedias
       * @apiGroup Media
       * @apiPermission admin
       *
       * @apiUse BaseHeader
       *
       * @apiParam  {Number{1-}}         [page=1]     List page
       * @apiParam  {Number{1-100}}      [perPage=1]  Medias per page
       * @apiParam  {String}             [fieldname]  Medias fieldname
       * @apiParam  {String}             [filename]   Medias filename
       * @apiParam  {String}             [path]       Medias path
       * @apiParam  {Number}             [size]       Medias size
       * @apiParam  {String}             [mimetype]   Medias mime type
       *
       * @apiSuccess (200 OK) {Medias[]}     media                Media instances
       * @apiSuccess (200 OK) {Number}       media.id             Media id
       * @apiSuccess (200 OK) {String}       media.fieldname      Media fieldname
       * @apiSuccess (200 OK) {String}       media.filename       Media filename
       * @apiSuccess (200 OK) {Number}       media.size           Media file size
       * @apiSuccess (200 OK) {User}         media.owner          Media owner user
       * @apiSuccess (200 OK) {Date}         media.createdAt      Media creation date
       * @apiSuccess (200 OK) {Date}         media.updatedAt      Media updating date
       *
       * @apiSuccessExample {json} Success response
       *  [
       *    {
       *      "id": 1,
       *      "fieldname": "cover",
       *      "filename": "javascript-1566722515926.jpg",
       *      "mimetype": "image/jpeg",
       *      "size": 36118,
       *      "createdAt": "2019-08-23T08:49:00.000Z",
       *      "updatedAt": null
       *    },
       *    {
       *      "id": 2,
       *      "fieldname": "avatar",
       *      "filename": "picture-1566722515926.jpg",
       *      "mimetype": "image/jpeg",
       *      "size": 4789,
       *      "createdAt": "2019-08-23T08:49:00.000Z",
       *      "updatedAt": null
       *    }
       *  ]
       *
       * @apiError (400 Bad Request)   ValidationError    Some parameters may contain invalid values
       * @apiUse BadRequest
       *
       * @apiError (401 Unauthorized)  Unauthorized Only authenticated users can access the data
       * @apiUse Unauthorized
       *
       * @apiError (403 Forbidden) Forbidden Only owner or admin can access the data
       * @apiUse Forbidden
       *
       * @apiError (406 Not Acceptable)  Content-Type Content-Type header must be "application/json".
       * @apiError (406 Not Acceptable)  Origin Origin header must be "https://*".
       * @apiUse NotAcceptable
       */
      .get(Guard.authorize([ROLE.admin, ROLE.user]), Validator.check(listMedias), MediaController.list)

      /**
       * @api {post} /medias Create media(s)
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
       *      "mimetype": "image/jpeg",
       *      "size": 36118,
       *      "createdAt": "2019-08-23T08:49:00.000Z",
       *      "updatedAt": null
       *    },
       *    {
       *      "id": 2,
       *      "fieldname": "avatar",
       *      "filename": "picture-1566722515926.jpg",
       *      "mimetype": "image/jpeg",
       *      "size": 4789,
       *      "createdAt": "2019-08-23T08:49:00.000Z",
       *      "updatedAt": null
       *    }
       *  ]
       *
       * @apiError (400 Bad Request)   ValidationError    Some parameters may contain invalid values
       * @apiUse BadRequest
       *
       * @apiError (401 Unauthorized)  Unauthorized Only authenticated users can access the data
       * @apiUse Unauthorized
       *
       * @apiError (406 Not Acceptable)  Content-Type Content-Type header must be "application/json".
       * @apiError (406 Not Acceptable)  Origin Origin header must be "https://*".
       * @apiUse NotAcceptable
       */
      .post(Guard.authorize([ROLE.admin, ROLE.user]), Uploader.upload( { wildcards: list(MIME_TYPE) } ), Validator.check(insertMedia), MediaController.create);

    this.router.route('/:mediaId')

      /**
       * @api {get} /medias/:id Get one media
       * @apiDescription Get media
       * @apiVersion 1.0.0
       * @apiName GetMedia
       * @apiGroup Media
       * @apiPermission user
       *
       * @apiUse BaseHeader
       *
       * @apiSuccess {Media}        media                Media instance
       * @apiSuccess {Number}       media.id             Media id
       * @apiSuccess {String}       media.fieldname      Media fieldname
       * @apiSuccess {String}       media.filename       Media filename
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
       *      "mimetype": "image/jpeg",
       *      "size": 36118,
       *      "createdAt": "2019-08-23T08:49:00.000Z",
       *      "updatedAt": null
       *    }
       *
       * @apiError (400 Bad Request)   ValidationError    Some parameters may contain invalid values
       * @apiUse BadRequest
       *
       * @apiError (401 Unauthorized)  Unauthorized Only authenticated users can access the data
       * @apiUse Unauthorized
       *
       * @apiError (403 Forbidden) Forbidden Only owner or admin can access the data
       * @apiUse Forbidden
       *
       * @apiError (404 Not Found) NotFound User does not exist
       * @apiUse NotFound
       *
       * @apiError (406 Not Acceptable)  Content-Type Content-Type header must be "application/json".
       * @apiError (406 Not Acceptable)  Origin Origin header must be "https://*".
       * @apiUse NotAcceptable
       *
       * @apiError (417 Expectation Failed) ExpectationFailed The id parameters failed to match
       * @apiUse ExpectationFailed
       */
      .get(Guard.authorize([ROLE.admin, ROLE.user]), Validator.check(getMedia), MediaController.get)

      /**
       * @api {put} /medias/:id Replace media
       * @apiDescription Replace the whole media with a new one
       * @apiVersion 1.0.0
       * @apiName ReplaceDocument
       * @apiGroup Media
       * @apiPermission user
       *
       * @apiUse MultipartHeader
       *
       * @apiSuccess {Media}        media                Media instance
       * @apiSuccess {Number}       media.id             Media id
       * @apiSuccess {String}       media.fieldname      Media fieldname
       * @apiSuccess {String}       media.filename       Media filename
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
       *      "mimetype": "image/jpeg",
       *      "size": 36118,
       *      "createdAt": "2019-08-23T08:49:00.000Z",
       *      "updatedAt": null
       *    }
       *
       * @apiError (400 Bad Request)   ValidationError    Some parameters may contain invalid values
       * @apiUse BadRequest
       *
       * @apiError (401 Unauthorized)  Unauthorized Only authenticated users can access the data
       * @apiUse Unauthorized
       *
       * @apiError (403 Forbidden) Forbidden Only owner or admin can access the data
       * @apiUse Forbidden
       *
       * @apiError (404 Not Found) NotFound User does not exist
       * @apiUse NotFound
       *
       * @apiError (406 Not Acceptable)  Content-Type Content-Type header must be "application/json".
       * @apiError (406 Not Acceptable)  Origin Origin header must be "https://*".
       * @apiUse NotAcceptable
       *
       * @apiError (417 Expectation Failed) ExpectationFailed The id parameters failed to match
       * @apiUse ExpectationFailed
       */
      .put(Guard.authorize([ROLE.admin, ROLE.user]), Validator.check(replaceMedia), MediaController.get, Uploader.upload( { wildcards: list(MIME_TYPE) } ), Validator.check(insertMedia), MediaController.update)

      /**
       * @api {patch} /medias/:id Update media
       * @apiDescription Update some fields of a media
       * @apiVersion 1.0.0
       * @apiName UpdateDocument
       * @apiGroup Media
       * @apiPermission user
       *
       * @apiUse MultipartHeader
       *
       * @apiSuccess {Media}        media                Media instance
       * @apiSuccess {Number}       media.id             Media id
       * @apiSuccess {String}       media.fieldname      Media fieldname
       * @apiSuccess {String}       media.filename       Media filename
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
       *      "mimetype": "image/jpeg",
       *      "size": 36118,
       *      "createdAt": "2019-08-23T08:49:00.000Z",
       *      "updatedAt": null
       *    }
       *
       * @apiError (400 Bad Request)   ValidationError    Some parameters may contain invalid values
       * @apiUse BadRequest
       *
       * @apiError (401 Unauthorized)  Unauthorized Only authenticated users can access the data
       * @apiUse Unauthorized
       *
       * @apiError (403 Forbidden) Forbidden Only owner or admin can access the data
       * @apiUse Forbidden
       *
       * @apiError (404 Not Found) NotFound User does not exist
       * @apiUse NotFound
       *
       * @apiError (406 Not Acceptable)  Content-Type Content-Type header must be "application/json".
       * @apiError (406 Not Acceptable)  Origin Origin header must be "https://*".
       * @apiUse NotAcceptable
       *
       * @apiError (417 Expectation Failed) ExpectationFailed The id parameters failed to match
       * @apiUse ExpectationFailed
       */
      .patch(Guard.authorize([ROLE.admin, ROLE.user]), Validator.check(updateMedia), MediaController.get, Uploader.upload( { wildcards: list(MIME_TYPE) } ), MediaController.update)

      /**
       * @api {patch} /medias/:id Delete media
       * @apiDescription Delete a media
       * @apiVersion 1.0.0
       * @apiName DeleteDocument
       * @apiGroup Media
       * @apiPermission user
       *
       * @apiUse BaseHeader
       *
       * @apiSuccess (204 No Content) / media successfully deleted
       *
       * @apiError (401 Unauthorized)  Unauthorized Only authenticated users can access the data
       * @apiUse Unauthorized
       *
       * @apiError (403 Forbidden) Forbidden Only user with same id or admins can access the data
       * @apiUse Forbidden
       *
       * @apiError (404 Not Found) NotFound User does not exist
       * @apiUse NotFound
       *
       * @apiError (406 Not Acceptable)  Content-Type Content-Type header must be "application/json".
       * @apiError (406 Not Acceptable)  Origin Origin header must be "https://*".
       * @apiUse NotAcceptable
       *
       * @apiError (417 Expectation Failed) ExpectationFailed The id parameters failed to match
       * @apiUse ExpectationFailed
       */
      .delete(Guard.authorize([ROLE.admin, ROLE.user]), Validator.check(removeMedia), MediaController.get, MediaController.remove);

  }
}