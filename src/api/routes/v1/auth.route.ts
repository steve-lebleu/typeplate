import { Router } from '@classes';
import { Validator } from '@middlewares/validator.middleware';
import { Guard } from '@middlewares/guard.middleware';
import { AuthController } from '@controllers/auth.controller';
import { register, login, refresh, oauthCb } from '@validations/auth.validation';

export class AuthRouter extends Router {

  constructor() {
    super();
  }

  /**
   * @description Plug routes definitions
   */
  define(): void {

    /**
     *
     * @apiDefine BaseHeaderSimple
     *
     * @apiHeader {String="application/json"} Content-Type   Mime-type
     * @apiHeader {String} Origin             Origin url
     *
     * @apiHeaderExample {json} Request headers
     * {
     *    "Content-Type": "application/json",
     *    "Origin": "https://your-host.com"
     * }
     *
     */

    /**
     *
     * @apiDefine BaseHeader
     *
     * @apiHeader {String="application/json"} Content-Type   Mime-type
     * @apiHeader {String}                    Origin         Origin url
     * @apiHeader {String}                    Authorization  Bearer access token
     *
     * @apiHeaderExample {json} Request headers
     * {
     *    "Content-Type": "application/json",
     *    "Origin": "https://your-host.com",
     *    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NzI2ODQ3MjgsImlhdCI6MTU2NTQyNzEyOCwic3ViIjoxfQ.h9OfTyJbzRmBtGcM1DOqtwkYlcFzoLjdVKHMV22tGBY"
     * }
     */

    /**
     *
     * @apiDefine MultipartHeader
     *
     * @apiHeader {String="multipart/form-data"}  Content-Type   Mime-type
     * @apiHeader {String}                        Origin         Origin url
     * @apiHeader {String}                        Authorization  Bearer access token
     *
     * @apiHeaderExample {json} Request headers
     * {
     *    "Content-Type": "multipart/form-data",
     *    "Origin": "https://your-host.com",
     *    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NzI2ODQ3MjgsImlhdCI6MTU2NTQyNzEyOCwic3ViIjoxfQ.h9OfTyJbzRmBtGcM1DOqtwkYlcFzoLjdVKHMV22tGBY"
     * }
     */

    /**
     * @apiDefine SuccessToken
     *
     * @apiSuccess {Object}   token                Main token object
     * @apiSuccess {String}   token.tokenType      Access Token's type
     * @apiSuccess {String}   token.accessToken    Authorization Token
     * @apiSuccess {String}   token.refreshToken   Token to get a new accessToken after expiration time
     * @apiSuccess {Date}     token.expiresIn      Access Token's expiration date
     *
     * @apiSuccessExample {json} Success response
     * {
     *    "token": {
     *      "tokenType": "Bearer"
     *      "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NzMyMDk2ODMsImlhdCI6MTU2NTk1MjA4Mywic3ViIjoxfQ.sbh-vFdVGvDfqsA1MFAG-lNJ-Fjoi24dlHNSqzZLqok",
     *      "refreshToken": "1.6df01971a1ce4dbe4b8752963e50b61632db5685e9c5c9dccedd93ec04b46cf25f40799dedeb926f",
     *      "expiresIn": "2019-11-08T10:41:23.619Z"
     *    }
     * }
     *
     */

    /**
     * @api {post} /auth/register Register
     * @apiDescription Register a new user.
     * @apiVersion 1.0.0
     * @apiName Register
     * @apiGroup Auth
     * @apiPermission public
     *
     * @apiUse BaseHeaderSimple
     *
     * @apiParam {String{..32}}      username  User username
     * @apiParam {String}            email     User email address
     * @apiParam {String{8..16}}     password  User password
     *
     * @apiParamExample {json} Payload example
     * {
     *    "username": "john-doe",
     *    "email": "contact@john-doe.com",
     *    "password": "lo1Rs9#q"
     * }
     *
     * @apiSuccess (Created 201) {Object}      token               Token main object
     * @apiSuccess (Created 201) {String}      token.tokenType     Access Token's type
     * @apiSuccess (Created 201) {String}      token.accessToken   Authorization Token
     * @apiSuccess (Created 201) {String}      token.refreshToken  Token to get a new accessToken after expiration time
     * @apiSuccess (Created 201) {Date}        token.expiresIn     Access Token's expiration date
     * @apiSuccess (Created 201) {User}        user                Current user
     * @apiSuccess (Created 201) {String}      user.id             User id
     * @apiSuccess (Created 201) {String}      user.username       User name
     * @apiSuccess (Created 201) {String}      user.email          User email
     * @apiSuccess (Created 201) {String}      user.role           User role
     * @apiSuccess (Created 201) {Provider[]}  user.providers      User providers of services
     * @apiSuccess (Created 201) {Smtp[]}      user.smtps          User smtp's
     * @apiSuccess (Created 201) {Date}        user.createdAt      User creation date
     * @apiSuccess (Created 201) {Date}        user.updatedAt      User updating date
     *
     * @apiSuccessExample {json} Success response
     * {
     *    "token": {
     *      "tokenType": "Bearer"
     *      "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NzMyMDk2ODMsImlhdCI6MTU2NTk1MjA4Mywic3ViIjoxfQ.sbh-vFdVGvDfqsA1MFAG-lNJ-Fjoi24dlHNSqzZLqok",
     *      "refreshToken": "1.6df01971a1ce4dbe4b8752963e50b61632db5685e9c5c9dccedd93ec04b46cf25f40799dedeb926f",
     *      "expiresIn": "2019-11-08T10:41:23.619Z"
     *    },
     *    "user": {
     *      "id": 1,
     *      "username": "johndoe",
     *      "email": "contact@john-doe.com",
     *      "role": "user",
     *      "providers": Provider[],
     *      "smtps": Smtp[],
     *      "createdAt": "2019-08-10T08:22:00.000Z",
     *      "updatedAt": null
     *    }
     * }
     *
     * @apiError (Bad Request 400)  ValidationError   Some parameters may contain invalid values
     * @apiError (Conflict 409)     MySQLError        Some parameters are already presents in database (username or email)
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
     * @apiErrorExample {json} MySQLError
     * {
     *    "statusCode": 409,
     *    "statusText": "Conflict",
     *    "errors": [
     *      "MySQL validation error"
     *    ]
     * }
     *
     */
    this.router
      .route('/register')
        .post(Validator.check(register), AuthController.register);

    /**
     * @api {post} /auth/login Login
     * @apiDescription Get an accessToken.
     * @apiVersion 1.0.0
     * @apiName Login
     * @apiGroup Auth
     * @apiPermission public
     *
     * @apiUse BaseHeaderSimple
     *
     * @apiParam  (With credentials)  {String}            email     User email address
     * @apiParam  (With credentials)  {String{8..16}}     password  User password
     * @apiParam  (With API key)      {String{64}}        apikey    User apikey
     *
     * @apiParamExample {json} Payload example
     * {
     *    "apikey": "$2b$10$sYFWFtKOR1QKm8/z6TxhQOgXCxvpZ.L13Xv3Lx496rH.L.EhobhJS"
     * }
     *
     * @apiSuccess (Success 200) {Object}      token               Token main object
     * @apiSuccess (Success 200) {String}      token.tokenType     Access Token's type
     * @apiSuccess (Success 200) {String}      token.accessToken   Authorization Token
     * @apiSuccess (Success 200) {String}      token.refreshToken  Token to get a new accessToken after expiration time
     * @apiSuccess (Success 200) {Date}        token.expiresIn     Access Token's expiration data
     * @apiSuccess (Success 200) {User}        user                Current user
     * @apiSuccess (Success 200) {String}      user.id             User id
     * @apiSuccess (Success 200) {String}      user.username       User name
     * @apiSuccess (Success 200) {String}      user.email          User email
     * @apiSuccess (Success 200) {String}      user.role           User role
     * @apiSuccess (Success 200) {Provider[]}  user.providers      User providers of services
     * @apiSuccess (Success 200) {Smtp[]}      user.smtps          User smtp's
     * @apiSuccess (Success 200) {Date}        user.createdAt      User creation date
     * @apiSuccess (Success 200) {Date}        user.updatedAt      User updating date
     *
     * @apiSuccessExample {json} Success response
     * {
     *    "token": {
     *      "tokenType": "Bearer"
     *      "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NzMyMDk2ODMsImlhdCI6MTU2NTk1MjA4Mywic3ViIjoxfQ.sbh-vFdVGvDfqsA1MFAG-lNJ-Fjoi24dlHNSqzZLqok",
     *      "refreshToken": "1.6df01971a1ce4dbe4b8752963e50b61632db5685e9c5c9dccedd93ec04b46cf25f40799dedeb926f",
     *      "expiresIn": "2019-11-08T10:41:23.619Z"
     *    },
     *    "user": {
     *      "id": 1,
     *      "username": "johndoe",
     *      "email": "contact@john-doe.com",
     *      "role": "user",
     *      "providers": Provider[],
     *      "smtps": Smtp[],
     *      "createdAt": "2019-08-10T08:22:00.000Z",
     *      "updatedAt": "2019-08-10T08:22:03.000Z"
     *    }
     * }
     *
     * @apiError (Bad Request 400)   ValidationError    Some parameters may contain invalid values
     * @apiError (Unauthorized 401)  Unauthorized       Incorrect password
     * @apiError (Not found 404)     Notfound           API key or email not found
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
     *      "Password must match to authorize a token generating"
     *    ]
     * }
     *
     * @apiErrorExample {json} NotFound
     * {
     *    "statusCode": 404,
     *    "statusText": "Not Found",
     *    "errors": [
     *     "User not found"
     *    ]
     * }
     *
     */
    this.router
      .route('/login')
        .post(Validator.check(login), AuthController.login);

    /**
     * @api {post} /auth/refresh-token Refresh token
     * @apiDescription Refresh expired accessToken.
     * @apiVersion 1.0.0
     * @apiName RefreshToken
     * @apiGroup Auth
     * @apiPermission public
     *
     * @apiUse BaseHeaderSimple
     *
     * @apiParam  {Object}  token               Main token aquired when user logged in
     * @apiParam  {string}  token.refreshToken  Refresh token
     *
     * @apiParamExample {json} Payload example
     * {
     *    "token": {
     *      "refreshToken": "1.6df01971a1ce4dbe4b8752963e50b61632db5685e9c5c9dccedd93ec04b46cf25f40799dedeb926f"
     *    }
     * }
     *
     * @apiUse SuccessToken
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     * @apiError (Not found 404)    NotFound         Refresh token not found
     *
     * @apiErrorExample {json} ValidationError
     * {
     *    "statusCode": 400,
     *    "statusText": "Bad request",
     *    "errors": [
     *      {
     *        "field": "token.refreshToken",
     *        "types": [
     *          "string.min"
     *        ],
     *        "messages": [
     *          "\"refreshToken\" length must be at least 82 characters long"
     *        ]
     *      }
     *    ]
     * }
     *
     * @apiErrorExample {json} NotFound
     * {
     *    "statusCode": 404,
     *    "statusText": "Not Found",
     *    "errors": [
     *     "RefreshObject not found"
     *    ]
     * }
     *
     */
    this.router
      .route('/refresh-token')
        .post(Validator.check(refresh), AuthController.refresh);

    /**
     * @api {get} /auth/facebook Facebook oAuth
     * @apiDescription Login with facebook. Obtains facebook authorization for oAuth
     * @apiVersion 1.0.0
     * @apiName FacebookOauth
     * @apiGroup Auth
     * @apiPermission public
     *
     * @apiUse BaseHeaderSimple
     *
     * @apiUse SuccessToken
     *
     * @apiError (Bad Request 400)    ValidationError   Some parameters may contain invalid values
     * @apiError (Unauthorized 401)   Unauthorized      Incorrect access_token
     *
     *
     * @apiErrorExample {json} Unauthorized example
     * {
     *    "statusCode": 401,
     *    "statusText": "Unauthorized",
     *    "errors": [
     *      "Invalid access token"
     *    ]
     * }
     *
     */
    this.router
      .route('/facebook')
        .get( Guard.oAuth('facebook') );

    /**
     * @api {get} /auth/facebook/callback Facebook oAuth callback
     * @apiDescription Login with facebook. Creates a new user if it does not exist.
     * @apiVersion 1.0.0
     * @apiName FacebookOauthCallback
     * @apiGroup Auth
     * @apiPermission public
     *
     * @apiUse BaseHeaderSimple
     *
     * @apiParam {String}  code  Facebook access_token
     *
     * @apiUse SuccessToken
     *
     * @apiError (Bad Request 400)    ValidationError   Some parameters may contain invalid values
     * @apiError (Unauthorized 401)   Unauthorized      Incorrect access_token
     *
     * @apiErrorExample {json} ValidationError
     * {
     *    "statusCode": 400,
     *    "statusText": "Bad request",
     *    "errors": [
     *      {
     *        "field": "code",
     *        "types": [
     *          "string.base"
     *        ],
     *        "messages": [
     *          "\"code\" must be a string"
     *        ]
     *      }
     *    ]
     * }
     *
     */
     this.router
     .route('/facebook/callback')
       .get( Validator.check(oauthCb), Guard.oAuthCallback('facebook'), AuthController.oAuth );

    /**
     * @api {get} /auth/google Google oAuth
     * @apiDescription Login with google.
     * @apiVersion 1.0.0
     * @apiName GoogleOauth
     * @apiGroup Auth
     * @apiPermission public
     *
     * @apiUse BaseHeaderSimple
     *
     * @apiUse SuccessToken
     *
     * @apiError (Bad Request 400)    ValidationError   Some parameters may contain invalid values
     * @apiError (Unauthorized 401)   Unauthorized      Incorrect access_token
     *
     */
    this.router
      .route('/google')
       .get( Guard.oAuth('google'), AuthController.oAuth );

    /**
     * @api {get} /auth/google/callback Google oAuth callback
     * @apiDescription Login with Google. Creates a new user if it does not exist.
     * @apiVersion 1.0.0
     * @apiName GoogleOauthCallback
     * @apiGroup Auth
     * @apiPermission public
     *
     * @apiUse BaseHeaderSimple
     *
     * @apiParam  {String}  code  Google access_token
     *
     * @apiUse SuccessToken
     *
     * @apiError (Bad Request 400)    ValidationError   Some parameters may contain invalid values
     * @apiError (Unauthorized 401)   Unauthorized      Incorrect access_token
     *
     * @apiErrorExample {json} ValidationError
     * {
     *    "statusCode": 400,
     *    "statusText": "Bad request",
     *    "errors": [
     *      {
     *        "field": "code",
     *        "types": [
     *          "string.base"
     *        ],
     *        "messages": [
     *          "\"code\" must be a string"
     *        ]
     *      }
     *    ]
     * }
     */
     this.router
     .route('/google/callback')
       .get( Validator.check(oauthCb), Guard.oAuthCallback('google'), AuthController.oAuth );

    /**
     * @api {get} /auth/github Github oAuth
     * @apiDescription Login with Github.
     * @apiVersion 1.0.0
     * @apiName GithubOauth
     * @apiGroup Auth
     * @apiPermission public
     *
     * @apiUse BaseHeaderSimple
     *
     * @apiUse SuccessToken
     *
     * @apiError (Bad Request 400)    ValidationError   Some parameters may contain invalid values
     * @apiError (Unauthorized 401)   Unauthorized      Incorrect access_token
     *
     */
     this.router
     .route('/github')
      .get( Guard.oAuth('github'), AuthController.oAuth );

   /**
    * @api {get} /auth/github/callback Github oAuth callback
    * @apiDescription Login with Github. Creates a new user if it does not exist.
    * @apiVersion 1.0.0
    * @apiName GithubOauthCallback
    * @apiGroup Auth
    * @apiPermission public
    *
    * @apiUse BaseHeaderSimple
    *
    * @apiParam  {String}  code  Github access_token
    *
    * @apiUse SuccessToken
    *
    * @apiError (Bad Request 400)    ValidationError   Some parameters may contain invalid values
    * @apiError (Unauthorized 401)   Unauthorized      Incorrect access_token
    *
    * @apiErrorExample {json} ValidationError
    * {
    *    "statusCode": 400,
    *    "statusText": "Bad request",
    *    "errors": [
    *      {
    *        "field": "code",
    *        "types": [
    *          "string.base"
    *        ],
    *        "messages": [
    *          "\"code\" must be a string"
    *        ]
    *      }
    *    ]
    * }
    */
    this.router
    .route('/github/callback')
      .get( Validator.check(oauthCb), Guard.oAuthCallback('github'), AuthController.oAuth );

    /**
     * @api {get} /auth/linkedin Linkedin oAuth
     * @apiDescription Login with Linkedin.
     * @apiVersion 1.0.0
     * @apiName LinkedinOauth
     * @apiGroup Auth
     * @apiPermission public
     *
     * @apiUse BaseHeaderSimple
     *
     * @apiUse SuccessToken
     *
     * @apiError (Bad Request 400)    ValidationError   Some parameters may contain invalid values
     * @apiError (Unauthorized 401)   Unauthorized      Incorrect access_token
     *
     */
     this.router
     .route('/linkedin')
      .get( Guard.oAuth('linkedin'), AuthController.oAuth );

   /**
    * @api {get} /auth/linkedin/callback Linkedin oAuth callback
    * @apiDescription Login with Linkedin. Creates a new user if it does not exist.
    * @apiVersion 1.0.0
    * @apiName LinkedinOauthCallback
    * @apiGroup Auth
    * @apiPermission public
    *
    * @apiUse BaseHeaderSimple
    *
    * @apiParam  {String}  code  Linkedin access_token
    *
    * @apiUse SuccessToken
    *
    * @apiError (Bad Request 400)    ValidationError   Some parameters may contain invalid values
    * @apiError (Unauthorized 401)   Unauthorized      Incorrect access_token
    *
    * @apiErrorExample {json} ValidationError
    * {
    *    "statusCode": 400,
    *    "statusText": "Bad request",
    *    "errors": [
    *      {
    *        "field": "code",
    *        "types": [
    *          "string.base"
    *        ],
    *        "messages": [
    *          "\"code\" must be a string"
    *        ]
    *      }
    *    ]
    * }
    */
    this.router
    .route('/linkedin/callback')
      .get( Validator.check(oauthCb), Guard.oAuthCallback('linkedin'), AuthController.oAuth );

  }
}