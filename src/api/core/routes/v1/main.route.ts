import { Router } from '@classes';
import { MainController } from '@controllers/main.controller';

/**
 * @apiDefine BaseHeaderSimple Request header
 *
 * @apiHeader {String="application/json"}       Content-Type    Mime-type of the request
 * @apiHeader {String="https://*"} Origin       Origin URL
 */

/**
 *
 * @apiDefine BaseHeader Authentified request header
 *
 * @apiHeader {String="application/json"}       Content-Type    Mime-type of the request
 * @apiHeader {String="https://*"} Origin       Origin URL
 * @apiHeader {String="Bearer ..."}             Authorization   Bearer access token
 */

/**
 *
 * @apiDefine MultipartHeader
 *
 * @apiHeader {String="multipart/form-data"}    Content-Type    Mime-type of the request
 * @apiHeader {String="https://*"} Origin       Origin URL
 * @apiHeader {String="Bearer ..."}             Authorization   Bearer access token
 */

/**
 * @apiDefine SuccessToken
 *
 * @apiSuccess {Object}   token                Main token object
 * @apiSuccess {String}   token.tokenType      Access token type
 * @apiSuccess {String}   token.accessToken    Access token
 * @apiSuccess {String}   token.refreshToken   Token to get a new accessToken after expiration time
 * @apiSuccess {Date}     token.expiresIn      Access tokens expiration date
 *
 * @apiSuccessExample {json} Success response example
 * {
 *    "token": {
 *      "tokenType": "Bearer"
 *      "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NzMyMDk2ODMsImlhdCI6MTU2NTk1MjA4Mywic3ViIjoxfQ.sbh-vFdVGvDfqsA1MFAG-lNJ-Fjoi24dlHNSqzZLqok",
 *      "refreshToken": "1.6df01971a1ce4dbe4b8752963e50b61632db5685e9c5c9dccedd93ec04b46cf25f40799dedeb926f",
 *      "expiresIn": "2019-11-08T10:41:23.619Z"
 *    }
 * }
 */

/**
 * @apiDefine SuccessTokenWithUser
 *
 * @apiSuccess (200 OK) {Token}       token               Token
 * @apiSuccess (200 OK) {String}      token.tokenType     Access token type
 * @apiSuccess (200 OK) {String}      token.accessToken   Access token
 * @apiSuccess (200 OK) {String}      token.refreshToken  Token to get a new accessToken after expiration time
 * @apiSuccess (200 OK) {Date}        token.expiresIn     Access Token expiration date
 *
 * @apiSuccess (200 OK) {User}        user                Current user
 * @apiSuccess (200 OK) {String}      user.id             User id
 * @apiSuccess (200 OK) {String}      user.username       Username
 * @apiSuccess (200 OK) {Media}       user.avatar         Profile picture
 * @apiSuccess (200 OK) {String}      user.email          Email address
 * @apiSuccess (200 OK) {String}      user.status         Account status
 * @apiSuccess (200 OK) {String}      user.role           User role
 * @apiSuccess (200 OK) {Date}        user.createdAt      User creation date
 * @apiSuccess (200 OK) {Date}        user.updatedAt      User updating date
 *
 * @apiSuccessExample {json} Success response example
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
 *      "avatar": {
 *        "id": 1,
 *        "fieldname": "avatar",
 *        "size": 4500,
 *        "mimetype": "image/jpg",
 *        "filename": "picture.jpg",
 *        "owner": 1
 *       }
 *      "email": "contact@john-doe.com",
 *      "status": "CONFIRMED",
 *      "role": "user",
 *      "createdAt": "2019-08-10T08:22:00.000Z",
 *      "updatedAt": "2019-08-10T08:22:03.000Z"
 *    }
 * }
 */

/**
 * @apiDefine SuccessOauth
 *
 * @apiSuccess (200 OK) {string} Code Token provided by supplier
 * @apiSuccessExample {json} Success response example
 *  {
 *    "code": "54fdsfefvc54refv21f5fse.fdsf8efdsfdf5azedfdfr"
 *  }
 */

/**
 * @apiDefine BadRequest
 *
 * @apiErrorExample {json} 400
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "statusCode": 400,
 *      "statusText": "Bad request",
 *      "errors": [
 *        {
 *          "field": "email",
 *          "types": [
 *            "string.email"
 *          ],
 *          "messages": [
 *            "\"email\" must be a valid email address"
 *          ]
 *        }
 *      ]
 *    }
 */

/**
 * @apiDefine Unauthorized
 *
 * @apiErrorExample {json} 401
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "statusCode": 401,
 *      "statusText": "Unauthorized",
 *      "errors": [
 *        "Password must match to authorize a token generating"
 *      ]
 *    }
 */

/**
 * @apiDefine Forbidden
 *
 * @apiErrorExample {json} 403
 *    HTTP/1.1 403 Forbidden
 *    {
 *      "statusCode": 403,
 *      "statusText": "Forbidden",
 *      "errors": [
 *        "Only user with same id or admin can access to resource"
 *      ]
 *    }
 */

/**
 * @apiDefine NotFound
 *
 * @apiErrorExample {json} 404
 *    HTTP/1.1 404 Not Found
 *    {
 *      "statusCode": 404,
 *      "statusText": "Not found",
 *      "errors": [
 *        "The requested resource cannot be found"
 *      ]
 *    }
 */

/**
 * @apiDefine NotAcceptable
 *
 * @apiErrorExample {json} 406
 *    HTTP/1.1 406 Not Acceptable
 *    {
 *      "statusCode": 406,
 *      "statusText": "Not acceptable",
 *      "errors": [
 *        "Content-Type should be application/json or multipart/form-data, text/html given"
 *      ]
 *    }
 */

/**
 * @apiDefine Conflict
 *
 * @apiErrorExample {json} 409
 *    HTTP/1.1 409 Conflict
 *    {
 *      "statusCode": 409,
 *      "statusText": "Conflict",
 *      "errors": [
 *        "Duplicate entry for key IDX.542115fs84521fsd"
 *      ]
 *    }
 */

/**
 * @apiDefine ExpectationFailed
 *
 * @apiErrorExample {json} 417
 *    HTTP/1.1 417 ExpectationFailed
 *    {
 *      "statusCode": 417,
 *      "statusText": "Expectation failed",
 *      "errors": [
 *        "id must be a number"
 *      ]
 *    }
 */

/**
 * @apiDefine UnprocessableEntity
 *
 * @apiErrorExample {json} 422
 *    HTTP/1.1 422 Unprocessable Entity
 *    {
 *      "statusCode": 422,
 *      "statusText": "Unprocessable Entity",
 *      "errors": [
 *        "Given user is not an instance of User: user.id not found"
 *      ]
 *    }
 */

/**
 * @apiDefine InternalServerError
 *
 * @apiErrorExample {json} 500
 *    HTTP/1.1 500 Internal Server Error
 *    {
 *      "statusCode": 500,
 *      "statusText": "Server error",
 *      "errors": [
 *        "Oops, an unexpected error was occurred"
 *      ]
 *    }
 */

/**
 * @apiDefine TimeoutGateway
 *
 * @apiErrorExample {json} 504
 *    HTTP/1.1 504 Timeout Gateway
 *    {
 *      "statusCode": 504,
 *      "statusText": "Timeout error",
 *      "errors": [
 *        "Max time of 30000ms exceeded"
 *      ]
 *    }
 */

export class MainRouter extends Router {

  constructor() {
    super()
  }

  /**
   * @description Plug routes definitions
   */
  define(): void {

    /**
     * @api {get} /status Ping API
     * @apiDescription Check the availability of the api.
     * @apiVersion 1.0.0
     * @apiName Status
     * @apiGroup Main
     * @apiPermission public
     *
     * @apiUse BaseHeaderSimple
     *
     * @apiSuccess (200 OK) {String} / Success message as "OK".
     * @apiSuccessExample Success
     *    HTTP/1.1 200
     *    OK
     *
     * @apiError (406 Not Acceptable) NotAcceptable An expected header value was not passed correctly.
     * @apiUse NotAcceptable
     *
     * @apiError (500 Internal Server Error) InternalServerError An unexpected error was occurred.
     * @apiUse InternalServerError
     */
    this.router.route('/status').get(MainController.status);

    /**
     * @api {post} /report-violation Log CSP
     *
     * @apiDescription Log security policy violation.
     * @apiVersion 1.0.0
     * @apiName CSPViolationReport
     * @apiGroup Main
     * @apiPermission public
     *
     * @apiUse BaseHeaderSimple
     *
     * @apiSuccess (200 OK) {Void} Created Report successfully logged.
     * @apiSuccessExample Success
     *    HTTP/1.1 200
     *
     * @apiError (406 Not Acceptable) NotAcceptable An expected header value was not passed correctly.
     * @apiUse NotAcceptable
     */
    this.router.route('/report-violation').post(MainController.report);

  }

}