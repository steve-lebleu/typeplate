import { notAcceptable } from "boom";
import { Request, Response } from "express";
import { APPLICATION_MIME_TYPE } from "@enums/mime-type.enum";

/**
 * Header validation middleware
 */
export class Header {

  constructor() {}

  /**
   * @description Check header validity according to current request and current configuration requirements
   * 
   * @param {APPLICATION_MIME_TYPE} contentType Configuration content-type
   * @param {Request} req Express request object derived from http.incomingMessage
   * @param {Response} res Express response object
   * @param {Function} next Callback function
   */
  static check = ({ contentType }) => (req: Request, res: Response, next: Function) => {
    if (!req.headers['content-type']) {
      return next( notAcceptable(`Content-Type header must be ${contentType} or 'multipart/form-data`) );
    }
    if ( APPLICATION_MIME_TYPE[contentType] !== req.headers['content-type'] && req.headers['content-type'].lastIndexOf(APPLICATION_MIME_TYPE['multipart/form-data']) === -1 ) {
      return next( notAcceptable(`Content-Type header must be ${contentType} or 'multipart/form-data`) );
    }
    if (!req.headers['origin']) {
      return next( notAcceptable(`Origin header must be specified`) );
    }
    next();
  }
};