import { Router } from '@classes';
import { UserController } from '@controllers/user.controller';
import { Guard } from '@middlewares/guard.middleware';
import { Uploader } from '@middlewares/uploader.middleware';
import { Validator } from '@middlewares/validator.middleware';
import { IMAGE_MIME_TYPE, ROLE } from '@enums';
import { listUsers, getUser, createUser, replaceUser, updateUser, removeUser } from '@validations/user.validation';
import { list } from '@utils/enum.util';

export class UserRouter extends Router {

  constructor() {
    super();
  }

  /**
   * @description Plug routes definitions
   */
  define(): void {

    this.router
      .route('/')

      /**
       * @api {get} /users List users
       * @apiDescription Get a list of users.
       * @apiVersion 1.0.0
       * @apiName ListUsers
       * @apiGroup User
       * @apiPermission admin,user
       *
       * @apiUse BaseHeader
       *
       * @apiParam  {Number{1-}}         [page=1]     List page
       * @apiParam  {Number{1-100}}      [perPage=1]  Users per page
       * @apiParam  {String}             [username]   User username
       * @apiParam  {String}             [email]      User email
       * @apiParam  {String=admin,user}  [role]       User role
       *
       * @apiSuccess (200 OK) {User[]}      user[]              User's who's match with query params
       * @apiSuccess (200 OK) {Number}      user.id             User id
       * @apiSuccess (200 OK) {String}      user.username       User name
       * @apiSuccess (200 OK) {Media}       user.avatar         User profile picture
       * @apiSuccess (200 OK) {String}      user.email          User email
       * @apiSuccess (200 OK) {String}      user.role           User role
       * @apiSuccess (200 OK) {String}      user.status         User status
       * @apiSuccess (200 OK) {Date}        user.createdAt      User creation date
       * @apiSuccess (200 OK) {Date}        user.updatedAt      User updating date
       *
       * @apiSuccessExample {json} Success response example
       * [
       *  {
       *    "id": 1,
       *    "username": "johndoe",
       *    "avatar": {
       *      "id": 1,
       *      "fieldname": "avatar",
       *      "size": 4500,
       *      "mimetype": "image/jpg",
       *      "filename": "picture.jpg",
       *      "owner": 1
       *    }
       *    "email": "contact@john-doe.com",
       *    "status": "REGISTERED",
       *    "role": "user",
       *    "createdAt": "2019-08-10T08:22:00.000Z",
       *    "updatedAt": "2019-08-10T08:22:03.000Z"
       *  },
       *  {
       *    "id": 2,
       *    "username": "johnpoe",
       *    "avatar": {
       *      "id": 1,
       *      "fieldname": "avatar",
       *      "size": 4500,
       *      "mimetype": "image/jpg",
       *      "filename": "picture.jpg",
       *      "owner": 1
       *    }
       *    "email": "contact@john-poe.com",
       *    "role": "user",
       *    "status": "REGISTERED",
       *    "createdAt": "2019-08-10T08:22:00.000Z",
       *    "updatedAt": "2019-08-10T08:22:03.000Z"
       *  }
       * ]
       *
       * @apiError (400 Bad Request)   ValidationError  Some parameters may contain invalid values
       * @apiUse BadRequest
       *
       * @apiError (403 Forbidden) Forbidden Only admins can list the data
       * @apiUse Forbidden
       *
       * @apiError (406 Not Acceptable)  Content-Type Content-Type header must be "application/json".
       * @apiError (406 Not Acceptable)  Origin Origin header must be "https://*".
       * @apiUse NotAcceptable
       */
      .get(Guard.authorize([ROLE.admin]), Validator.check(listUsers), UserController.list)

      /**
       * @api {post} /users Create user
       * @apiDescription Create a new user.
       * @apiVersion 1.0.0
       * @apiName CreateUser
       * @apiGroup User
       * @apiPermission admin
       *
       * @apiUse BaseHeader
       *
       * @apiParam  {String}          email         User email
       * @apiParam  {String{8..16}}   password      User password
       * @apiParam  {String{..32}}    username      Username
       * @apiParam  {Media}           avatar        Profile picture
       * @apiParam  {String="REGISTERED", "REVIEWED", "CONFIRMED", "BANNED"} status User status
       * @apiParam  {String="admin", "user"} [role] User role
       *
       * @apiSuccess (201 Created) {User}        user                Created user
       * @apiSuccess (201 Created) {String}      user.id             User id
       * @apiSuccess (201 Created) {String}      user.username       Username
       * @apiSuccess (201 Created) {Media}       user.avatar         Profile picture
       * @apiSuccess (201 Created) {String}      user.email          Email address
       * @apiSuccess (201 Created) {String}      user.status         Account status
       * @apiSuccess (201 Created) {String}      user.role           User role
       * @apiSuccess (201 Created) {Date}        user.createdAt      User creation date
       * @apiSuccess (201 Created) {Date}        user.updatedAt      User updating date
       *
       * @apiSuccessExample {json} Success response example
       * {
       *    "id": 1,
       *    "username": "johndoe",
       *    "avatar": {
       *      "id": 1,
       *      "fieldname": "avatar",
       *      "size": 4500,
       *      "mimetype": "image/jpg",
       *      "filename": "picture.jpg",
       *      "owner": 1
       *    }
       *    "email": "contact@john-doe.com",
       *    "status": "CONFIRMED",
       *    "role": "user",
       *    "createdAt": "2019-08-10T08:22:00.000Z",
       *    "updatedAt": "2019-08-10T08:22:03.000Z"
       * }
       *
       * @apiError (400 Bad Request)   ValidationError  Some parameters may contain invalid values
       * @apiUse BadRequest
       *
       * @apiError (401 Unauthorized)  Unauthorized     Only authenticated users can create the data
       * @apiUse Unauthorized
       *
       * @apiError (403 Forbidden)     Forbidden        Only admins can create the data
       * @apiUse Forbidden
       *
       * @apiError (406 Not Acceptable)  Content-Type Content-Type header must be "application/json".
       * @apiError (406 Not Acceptable)  Origin Origin header must be "https://*".
       * @apiUse NotAcceptable
       *
       * @apiError (409 Conflict) MySQLError Some parameters are already presents in database (username or email)
       * @apiUse Conflict
       */
      .post(Guard.authorize([ROLE.admin]), Validator.check(createUser), UserController.create);

    this.router
      .route('/profile')

      /**
       * @api {get} /users/profile Profile
       * @apiDescription Get logged in user profile information.
       * @apiVersion 1.0.0
       * @apiName UserProfile
       * @apiGroup User
       * @apiPermission user
       *
       * @apiUse BaseHeader
       *
       * @apiSuccess (200 OK) {User}        user                User
       * @apiSuccess (200 OK) {Media}       user.avatar         User profile picture
       * @apiSuccess (200 OK) {String}      user.username       User name
       * @apiSuccess (200 OK) {String}      user.email          User email
       * @apiSuccess (200 OK) {String}      user.role           User role
       * @apiSuccess (200 OK) {String}      user.status         User status
       * @apiSuccess (200 OK) {Date}        user.createdAt      User creation date
       * @apiSuccess (200 OK) {Date}        user.updatedAt      User updating date
       *
       * @apiSuccessExample {json} Success response example
       * {
       *    "id": 1,
       *    "username": "johndoe",
       *    "avatar": {
       *      "id": 1,
       *      "fieldname": "avatar",
       *      "size": 4500,
       *      "mimetype": "image/jpg",
       *      "filename": "picture.jpg",
       *      "owner": 1
       *    }
       *    "email": "contact@john-doe.com",
       *    "status": "CONFIRMED",
       *    "role": "user",
       *    "createdAt": "2019-08-10T08:22:00.000Z",
       *    "updatedAt": "2019-08-10T08:22:03.000Z"
       * }
       *
       * @apiError (401 Unauthorized)         Unauthorized        Only authenticated users can access the data
       * @apiUse Unauthorized
       *
       * @apiError (404 Not Found)            NotFound            User does not exist
       * @apiUse NotFound
       *
       * @apiError (406 Not Acceptable)  Content-Type Content-Type header must be "application/json".
       * @apiError (406 Not Acceptable)  Origin Origin header must be "https://*".
       * @apiUse NotAcceptable
       */
      .get(Guard.authorize([ROLE.admin,ROLE.user]), UserController.loggedIn);

    this.router
      .route('/:userId(\\d+)')

      /**
       * @api {get} /users/:id Get one user
       * @apiDescription Get user information.
       * @apiVersion 1.0.0
       * @apiName GetUser
       * @apiGroup User
       * @apiPermission user
       *
       * @apiUse BaseHeader
       *
       * @apiSuccess (200 OK) {User}        user                User
       * @apiSuccess (200 OK) {Media}       user.avatar         User profile picture
       * @apiSuccess (200 OK) {String}      user.username       User name
       * @apiSuccess (200 OK) {String}      user.email          User email
       * @apiSuccess (200 OK) {String}      user.role           User role
       * @apiSuccess (200 OK) {String}      user.status         User status
       * @apiSuccess (200 OK) {Date}        user.createdAt      User creation date
       * @apiSuccess (200 OK) {Date}        user.updatedAt      User updating date
       *
       * @apiSuccessExample {json} Success response example
       * {
       *    "id": 1,
       *    "username": "johndoe",
       *    "avatar": {
       *      "id": 1,
       *      "fieldname": "avatar",
       *      "size": 4500,
       *      "mimetype": "image/jpg",
       *      "filename": "picture.jpg",
       *      "owner": 1
       *    }
       *    "email": "contact@john-doe.com",
       *    "status": "CONFIRMED",
       *    "role": "user",
       *    "createdAt": "2019-08-10T08:22:00.000Z",
       *    "updatedAt": "2019-08-10T08:22:03.000Z"
       * }
       *
       * @apiError (401 Unauthorized)         Unauthorized        Only authenticated users can access the data
       * @apiUse Unauthorized
       *
       * @apiError (403 Forbidden)            Forbidden           Only user with same id or admins can access the data
       * @apiUse Forbidden
       *
       * @apiError (404 Not Found)            NotFound            User does not exist
       * @apiUse NotFound
       *
       * @apiError (406 Not Acceptable)  Content-Type Content-Type header must be "application/json".
       * @apiError (406 Not Acceptable)  Origin Origin header must be "https://*".
       * @apiUse NotAcceptable
       *
       * @apiError (417 Expectation Failed)   ExpectationFailed   The id parameters failed to match
       * @apiUse ExpectationFailed
       */
      .get(Guard.authorize([ROLE.admin]), Validator.check(getUser), UserController.get)

      /**
       * @api {put} /users/:id Replace user
       * @apiDescription Replace the whole user document with a new one.
       * @apiVersion 1.0.0
       * @apiName ReplaceUser
       * @apiGroup User
       * @apiPermission user
       *
       * @apiUse BaseHeader
       *
       * @apiParam  {String} email User email
       * @apiParam  {String{8..16}} password User password
       * @apiParam  {String{..32}} username User username
       * @apiParam  {String=admin,user,ghost} role User role
       * @apiParam  {Media} avatar User profile picture
       * @apiParam  {String=REGISTERED,CONFIRMED,REVIEWED,BANNED} status User status
       *
       * @apiSuccess (200 OK) {User}        user                User
       * @apiSuccess (200 OK) {Media}       user.avatar         User profile picture
       * @apiSuccess (200 OK) {String}      user.username       User name
       * @apiSuccess (200 OK) {String}      user.email          User email
       * @apiSuccess (200 OK) {String}      user.role           User role
       * @apiSuccess (200 OK) {String}      user.status         User status
       * @apiSuccess (200 OK) {Date}        user.createdAt      User creation date
       * @apiSuccess (200 OK) {Date}        user.updatedAt      User updating date
       *
       * @apiSuccessExample {json} Success response example
       * {
       *    "id": 1,
       *    "username": "johndoe",
       *    "avatar": {
       *      "id": 1,
       *      "fieldname": "avatar",
       *      "size": 4500,
       *      "mimetype": "image/jpg",
       *      "filename": "picture.jpg",
       *      "owner": 1
       *    }
       *    "email": "contact@john-doe.com",
       *    "status": "CONFIRMED",
       *    "role": "user",
       *    "createdAt": "2019-08-10T08:22:00.000Z",
       *    "updatedAt": "2019-08-10T08:22:03.000Z"
       * }
       *
       * @apiError (400 Bad Request)   ValidationError  Some parameters may contain invalid values
       * @apiUse BadRequest
       *
       * @apiError (401 Unauthorized)  Unauthorized     Only authenticated users can udpate the data
       * @apiUse Unauthorized
       *
       * @apiError (403 Forbidden)  Forbidden     Only user with same id or admins can access the data
       * @apiUse Forbidden
       *
       * @apiError (404 Not Found)     UserNotFound     User not found
       * @apiUse Forbidden
       *
       * @apiError (406 Not Acceptable)  Content-Type Content-Type header must be "application/json".
       * @apiError (406 Not Acceptable)  Origin Origin header must be "https://*".
       * @apiUse NotAcceptable
       *
       * @apiError (409 Conflict) MySQLError Some parameters are already presents in database (username or email)
       * @apiUse Conflict
       *
       * @apiError (417 Expectation Failed)   ExpectationFailed   The id parameters failed to match
       * @apiUse ExpectationFailed
       */
      .put(Guard.authorize([ROLE.admin, ROLE.user]),  Uploader.upload( { wildcards: list(IMAGE_MIME_TYPE) } ),  Validator.check(replaceUser), UserController.update)

      /**
       * @api {patch} /users/:id Update user
       * @apiDescription Update some fields of an user document.
       * @apiVersion 1.0.0
       * @apiName UpdateUser
       * @apiGroup User
       * @apiPermission user
       *
       * @apiUse BaseHeader
       *
       * @apiParam  {String} [email] User email
       * @apiParam  {String{8..16}} [password] User password
       * @apiParam  {String{..32}} [username] User username
       * @apiParam  {String=admin,user,ghost} [role] User role
       * @apiParam  {Media} [avatar] User profile picture
       * @apiParam  {String=REGISTERED,CONFIRMED,REVIEWED,BANNED} [status] User status
       *
       * @apiSuccess (200 OK) {User}        user                User
       * @apiSuccess (200 OK) {Media}       user.avatar         User profile picture
       * @apiSuccess (200 OK) {String}      user.username       User name
       * @apiSuccess (200 OK) {String}      user.email          User email
       * @apiSuccess (200 OK) {String}      user.role           User role
       * @apiSuccess (200 OK) {String}      user.status         User status
       * @apiSuccess (200 OK) {Date}        user.createdAt      User creation date
       * @apiSuccess (200 OK) {Date}        user.updatedAt      User updating date
       *
       * @apiSuccessExample {json} Success response example
       * {
       *    "id": 1,
       *    "username": "johndoe",
       *    "avatar": {
       *      "id": 1,
       *      "fieldname": "avatar",
       *      "size": 4500,
       *      "mimetype": "image/jpg",
       *      "filename": "picture.jpg",
       *      "owner": 1
       *    }
       *    "email": "contact@john-doe.com",
       *    "status": "CONFIRMED",
       *    "role": "user",
       *    "createdAt": "2019-08-10T08:22:00.000Z",
       *    "updatedAt": "2019-08-10T08:22:03.000Z"
       * }
       *
       * @apiError (400 Bad Request)   ValidationError  Some parameters may contain invalid values
       * @apiUse BadRequest
       *
       * @apiError (401 Unauthorized)  Unauthorized     Only authenticated users can udpate the data
       * @apiUse Unauthorized
       *
       * @apiError (403 Forbidden)  Forbidden     Only user with same id or admins can access the data
       * @apiUse Forbidden
       *
       * @apiError (404 Not Found)     UserNotFound     User not found
       * @apiUse Forbidden
       *
       * @apiError (406 Not Acceptable)  Content-Type Content-Type header must be "application/json".
       * @apiError (406 Not Acceptable)  Origin Origin header must be "https://*".
       * @apiUse NotAcceptable
       *
       * @apiError (409 Conflict) MySQLError Some parameters are already presents in database (username or email)
       * @apiUse Conflict
       *
       * @apiError (417 Expectation Failed)   ExpectationFailed   The id parameters failed to match
       * @apiUse ExpectationFailed
       */
      .patch(Guard.authorize([ROLE.admin, ROLE.user]),  Uploader.upload( { wildcards: list(IMAGE_MIME_TYPE) } ), Validator.check(updateUser), UserController.update)

      /**
       * @api {patch} /users/:id Delete user
       * @apiDescription Delete an user.
       * @apiVersion 1.0.0
       * @apiName DeleteUser
       * @apiGroup User
       * @apiPermission user
       *
       * @apiUse BaseHeader
       *
       * @apiSuccess (204 No Content) / User successfully deleted
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
      .delete(Guard.authorize([ROLE.admin]), Validator.check(removeUser), UserController.remove);

  }

}