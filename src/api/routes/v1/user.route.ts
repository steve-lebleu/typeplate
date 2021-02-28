import { Router } from '@bases/router.class';
import { Container } from '@config/container.config';
import { Guard, ADMIN, LOGGED_USER } from '@middlewares/guard.middleware';
import { Validator } from '@middlewares/validator.middleware';

import { listUsers, getUser, createUser, replaceUser, updateUser, removeUser } from '@validations/user.validation';

export class UserRouter extends Router {

  constructor() {
 super();
}

  /**
   * @description Plug routes definitions
   */
  define() {

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
       * @apiSuccess (Success 200) {User[]}      user[]              User's who's match with query params
       * @apiSuccess (Success 200) {String}      user.id             User id
       * @apiSuccess (Success 200) {String}      user.username       User name
       * @apiSuccess (Success 200) {String}      user.email          User email
       * @apiSuccess (Success 200) {String}      user.role           User role
       * @apiSuccess (Success 200) {Provider[]}  user.providers      User providers of services
       * @apiSuccess (Success 200) {Smtp[]}      user.smtps          User smtp's
       * @apiSuccess (Success 200) {Date}        user.createdAt      User creation date
       * @apiSuccess (Success 200) {Date}        user.updatedAt      User updating date
       *
       * @apiSuccessExample {json} Success response example
       * [
       *  {
       *    "id": 1,
       *    "username": "johndoe",
       *    "email": "contact@john-doe.com",
       *    "role": "user",
       *    "providers": Provider[],
       *    "smtps": Smtp[],
       *    "createdAt": "2019-08-10T08:22:00.000Z",
       *    "updatedAt": "2019-08-10T08:22:03.000Z"
       *  },
       *  {
       *    "id": 2,
       *    "username": "johnpoe",
       *    "email": "contact@john-poe.com",
       *    "role": "user",
       *    "providers": Provider[],
       *    "smtps": Smtp[],
       *    "createdAt": "2019-08-10T08:22:00.000Z",
       *    "updatedAt": "2019-08-10T08:22:03.000Z"
       *  }
       * ]
       *
       * @apiError (Bad Request 400)   ValidationError    Some parameters may contain invalid values
       * @apiError (Unauthorized 403)  Forbidden          Incorrect token or unsuffisant access rights
       *
       * @apiErrorExample {json} ValidationError
       * {
       *    "statusCode": 400,
       *    "statusText": "Bad request",
       *    "errors": [
       *      {
       *        "field": "email",
       *        "types": [
       *          "string.email"
       *        ],
       *        "messages": [
       *          "\"email\" must be a valid email address"
       *        ]
       *      }
       *    ]
       * }
       *
       * @apiErrorExample {json} Forbidden
       * {
       *    "statusCode": 403,
       *    "statusText": "Forbidden",
       *    "errors": [
       *      "You can't access to this ressource"
       *    ]
       * }
       *
       */
      .get(Guard.authorize([ADMIN]), Validator.validate(listUsers), Container.resolve('UserController').list)

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
       * @apiParam  {String{..32}}    username      User username
       * @apiParam  {Provider[]}      [providers]   User providers
       * @apiParam  {Smtp[]}          [smtps]       User smtps
       * @apiParam  {String=admin}    [role]        User role
       *
       * @apiSuccess (Success 200) {User}        user                User
       * @apiSuccess (Success 200) {String}      user.username       User name
       * @apiSuccess (Success 200) {String}      user.username       User name
       * @apiSuccess (Success 200) {String}      user.email          User email
       * @apiSuccess (Success 200) {String}      user.role           User role
       * @apiSuccess (Success 200) {Provider[]}  user.providers      User providers of services
       * @apiSuccess (Success 200) {Smtp[]}      user.smtps          User smtp's
       * @apiSuccess (Success 200) {Date}        user.createdAt      User creation date
       * @apiSuccess (Success 200) {Date}        user.updatedAt      User updating date
       *
       * @apiSuccessExample {json} Success response example
       *  {
       *    "id": 25,
       *    "username": "johndoe",
       *    "email": "contact@john-doe.com",
       *    "role": "user",
       *    "providers": Provider[],
       *    "smtps": Smtp[],
       *    "createdAt": "2019-08-10T08:22:00.000Z",
       *    "updatedAt": "2019-08-10T08:22:03.000Z"
       *  }
       *
       * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
       * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
       * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
       *
       * @apiErrorExample {json} ValidationError
       * {
       *    "statusCode": 400,
       *    "statusText": "Bad request",
       *    "errors": [
       *      {
       *        "field": "email",
       *        "types": [
       *          "string.email"
       *        ],
       *        "messages": [
       *          "\"email\" must be a valid email address"
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
       *    "statusText": "Forbidden",
       *    "errors": [
       *      "No auth token"
       *    ]
       * }
       *
       */
      .post(Guard.authorize([ADMIN]), Validator.validate(createUser), Container.resolve('UserController').create);

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
       * @apiSuccess (Success 200) {User}        user                User
       * @apiSuccess (Success 200) {String}      user.username       User name
       * @apiSuccess (Success 200) {String}      user.username       User name
       * @apiSuccess (Success 200) {String}      user.email          User email
       * @apiSuccess (Success 200) {String}      user.role           User role
       * @apiSuccess (Success 200) {Provider[]}  user.providers      User providers of services
       * @apiSuccess (Success 200) {Smtp[]}      user.smtps          User smtp's
       * @apiSuccess (Success 200) {Date}        user.createdAt      User creation date
       * @apiSuccess (Success 200) {Date}        user.updatedAt      User updating date
       *
       * @apiSuccessExample {json} Success response
       *  {
       *    "id": 25,
       *    "username": "johndoe",
       *    "email": "contact@john-doe.com",
       *    "role": "user",
       *    "providers": Provider[],
       *    "smtps": Smtp[],
       *    "createdAt": "2019-08-10T08:22:00.000Z",
       *    "updatedAt": "2019-08-10T08:22:03.000Z"
       *  }
       *
       * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Users can access the data
       *
       * @apiErrorExample {json} Unauthorized
       * {
       *    "statusCode": 401,
       *    "statusText": "Unauthorized",
       *    "errors": [
       *      "Forbidden area"
       *    ]
       * }
       */
      .get(Guard.authorize([ADMIN,LOGGED_USER]), Container.resolve('UserController').loggedIn);

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
       * @apiSuccess (Success 200) {User}        user                User
       * @apiSuccess (Success 200) {String}      user.username       User name
       * @apiSuccess (Success 200) {String}      user.username       User name
       * @apiSuccess (Success 200) {String}      user.email          User email
       * @apiSuccess (Success 200) {String}      user.role           User role
       * @apiSuccess (Success 200) {Provider[]}  user.providers      User providers of services
       * @apiSuccess (Success 200) {Smtp[]}      user.smtps          User smtp's
       * @apiSuccess (Success 200) {Date}        user.createdAt      User creation date
       * @apiSuccess (Success 200) {Date}        user.updatedAt      User updating date
       *
       * @apiSuccessExample {json} Success response
       *  {
       *    "id": 25,
       *    "username": "johndoe",
       *    "email": "contact@john-doe.com",
       *    "role": "user",
       *    "providers": Provider[],
       *    "smtps": Smtp[],
       *    "createdAt": "2019-08-10T08:22:00.000Z",
       *    "updatedAt": "2019-08-10T08:22:03.000Z"
       *  }
       *
       * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can access the data
       * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can access the data
       * @apiError (Not Found 404)    NotFound      User does not exist
       * @apiError (Expectation failed 417)   ExpectationFailed   The id parameters failed to match
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
       *      "User not found"
       *    ]
       * }
       *
       * @apiErrorExample {json} ExpectationFailed
       * {
       *    "statusCode": 417,
       *    "statusText": "Expectation failed",
       *    "errors": [
       *      ":userId parameter must be a number"
       *    ]
       * }
       *
       */
      .get(Guard.authorize([ADMIN]), Validator.validate(getUser), Container.resolve('UserController').get)

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
       * @apiParam  {String}          [email]         User email
       * @apiParam  {String{8..16}}   [password]      User password
       * @apiParam  {String{..32}}    [username]      User username
       * @apiParam  {Provider[]}      [providers]     User providers
       * @apiParam  {Smtp[]}          [smtps]         User smtps
       * @apiParam  {String=admin}    [role]          User role
       *
       * @apiSuccess (Success 200) {User}        user                User
       * @apiSuccess (Success 200) {String}      user.username       User name
       * @apiSuccess (Success 200) {String}      user.username       User name
       * @apiSuccess (Success 200) {String}      user.email          User email
       * @apiSuccess (Success 200) {String}      user.role           User role
       * @apiSuccess (Success 200) {Provider[]}  user.providers      User providers of services
       * @apiSuccess (Success 200) {Smtp[]}      user.smtps          User smtp's
       * @apiSuccess (Success 200) {Date}        user.createdAt      User creation date
       * @apiSuccess (Success 200) {Date}        user.updatedAt      User updating date
       *
       * @apiSuccessExample {json} Success response
       *  {
       *    "id": 25,
       *    "username": "johndoe",
       *    "email": "contact@john-doe.com",
       *    "role": "user",
       *    "providers": Provider[],
       *    "smtps": Smtp[],
       *    "createdAt": "2019-08-10T08:22:00.000Z",
       *    "updatedAt": "2019-08-10T08:22:03.000Z"
       *  }
       *
       * @apiError (Bad Request 400)  ValidationError   Some parameters may contain invalid values
       * @apiError (Unauthorized 401) Unauthorized      Only authenticated users can access the data
       * @apiError (Forbidden 403)    Forbidden         Only user with same id or admins can access the data
       * @apiError (Not Found 404)    NotFound          User does not exist
       * @apiError (Expectation failed 417)   ExpectationFailed   The id parameters failed to match
       *
       * @apiErrorExample {json} ValidationError
       * {
       *    "statusCode": 400,
       *    "statusText": "Bad request",
       *    "errors": [
       *      {
       *        "field": "email",
       *        "types": [
       *          "string.email"
       *        ],
       *        "messages": [
       *          "\"email\" must be a valid email address"
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
       *      "User not found"
       *    ]
       * }
       *
       * @apiErrorExample {json} ExpectationFailed
       * {
       *    "statusCode": 417,
       *    "statusText": "Expectation failed",
       *    "errors": [
       *      ":userId parameter must be a number"
       *    ]
       * }
       *
       */
      .put(Guard.authorize([ADMIN]), Validator.validate(replaceUser), Container.resolve('UserController').update)

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
       * @apiParam  {String}          [email]         User email
       * @apiParam  {String{8..16}}   [password]      User password
       * @apiParam  {String{..32}}    [username]      User username
       * @apiParam  {Provider[]}      [providers]     User providers
       * @apiParam  {Smtp[]}          [smtps]         User smtps
       * @apiParam  {String=admin}    [role]          User role
       *
       * @apiSuccess (Success 200) {User}        user                User
       * @apiSuccess (Success 200) {String}      user.username       User name
       * @apiSuccess (Success 200) {String}      user.username       User name
       * @apiSuccess (Success 200) {String}      user.email          User email
       * @apiSuccess (Success 200) {String}      user.role           User role
       * @apiSuccess (Success 200) {Provider[]}  user.providers      User providers of services
       * @apiSuccess (Success 200) {Smtp[]}      user.smtps          User smtp's
       * @apiSuccess (Success 200) {Date}        user.createdAt      User creation date
       * @apiSuccess (Success 200) {Date}        user.updatedAt      User updating date
       *
       * @apiSuccessExample {json} Success response
       *  {
       *    "id": 25,
       *    "username": "johndoe",
       *    "email": "contact@john-doe.com",
       *    "role": "user",
       *    "providers": Provider[],
       *    "smtps": Smtp[],
       *    "createdAt": "2019-08-10T08:22:00.000Z",
       *    "updatedAt": "2019-08-10T08:22:03.000Z"
       *  }
       *
       * @apiError (Bad Request 400)  ValidationError   Some parameters may contain invalid values
       * @apiError (Unauthorized 401) Unauthorized      Only authenticated users can access the data
       * @apiError (Forbidden 403)    Forbidden         Only user with same id or admins can access the data
       * @apiError (Not Found 404)    NotFound          User does not exist
       * @apiError (Expectation failed 417)   ExpectationFailed   The id parameters failed to match
       *
       * @apiErrorExample {json} ValidationError
       * {
       *    "statusCode": 400,
       *    "statusText": "Bad request",
       *    "errors": [
       *      {
       *        "field": "email",
       *        "types": [
       *          "string.email"
       *        ],
       *        "messages": [
       *          "\"email\" must be a valid email address"
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
       *      "User not found"
       *    ]
       * }
       *
       * @apiErrorExample {json} ExpectationFailed
       * {
       *    "statusCode": 417,
       *    "statusText": "Expectation failed",
       *    "errors": [
       *      ":userId parameter must be a number"
       *    ]
       * }
       *
       */
      .patch(Guard.authorize([ADMIN]), Validator.validate(updateUser), Container.resolve('UserController').update)

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
       * @apiSuccess (No Content 204) Successfully deleted
       *
       * @apiError (Unauthorized 401)         Unauthorized        Only authenticated users can access the data
       * @apiError (Forbidden 403)            Forbidden           Only user with same id or admins can access the data
       * @apiError (Not Found 404)            NotFound            User does not exist
       * @apiError (Expectation failed 417)   ExpectationFailed   The id parameters failed to match
       *
       * @apiErrorExample {json} ValidationError
       * {
       *    "statusCode": 400,
       *    "statusText": "Bad request",
       *    "errors": [
       *      {
       *        "field": "email",
       *        "types": [
       *          "string.email"
       *        ],
       *        "messages": [
       *          "\"email\" must be a valid email address"
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
       *      "User not found"
       *    ]
       * }
       *
       * @apiErrorExample {json} ExpectationFailed
       * {
       *    "statusCode": 417,
       *    "statusText": "Expectation failed",
       *    "errors": [
       *      ":userId parameter must be a number"
       *    ]
       * }
       *
       */
      .delete(Guard.authorize([ADMIN]), Validator.validate(removeUser), Container.resolve('UserController').remove);

  }

}