import { notAcceptable } from 'boom';
import { Request, Response } from 'express';
import { CONTENT_MIME_TYPE } from '@enums/mime-type.enum';

/**
 * Cors validation middleware
 */
export class Cors {

  constructor() {}

  /**
   * @description Check header validity according to current request and current configuration requirements
   *
   * @param contentType Configuration content-type
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  static check = (contentType: string) => (req: Request, res: Response, next: (e?: Error) => void): void => {
    if (!req.headers['content-type']) {
      return next( notAcceptable(`Content-Type headers must be ${contentType} or 'multipart/form-data', ${req.headers['content-type']} given`) );
    }
    if ( CONTENT_MIME_TYPE[contentType] !== req.headers['content-type'] && req.headers['content-type'].lastIndexOf(CONTENT_MIME_TYPE['multipart/form-data']) === -1 ) {
      return next( notAcceptable(`Content-Type head must be ${contentType} or 'multipart/form-data, ${req.headers['content-type']} given`) );
    }
    if (!req.headers.origin) {
      return next( notAcceptable('Origin header must be specified') );
    }
    next();
  }
}