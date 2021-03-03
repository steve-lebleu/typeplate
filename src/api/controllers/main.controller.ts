import { Request, Response } from 'express';
import { OK } from 'http-status';

import { Logger } from '@services/logger.service';
import { safe } from '@decorators/safe.decorator';

/**
 * Manage incoming requests from api/{version}/.
 * End points of this router resolve response by itself.
 */
export class MainController {

  constructor() {}

  /**
   * @description Ping api
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @safe
  static status = (req: Request, res: Response): any => {
    res.status(OK);
    res.end();
  };

  /**
   * @description Log CSP report violation. This endpoint is called programmaticaly by helmet.
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @safe
  static report = (req: Request, res: Response): any => {
    Logger.log('error', req.body ? `CSP Violation: ${JSON.stringify(req.body)}` : 'CSP Violation', { label: 'CSP violation' });
    res.status(OK);
    res.end();
  };

}