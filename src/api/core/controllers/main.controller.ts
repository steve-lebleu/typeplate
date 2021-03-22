import { Request, Response } from 'express';

import { Logger } from '@services/logger.service';

/**
 * Manage incoming requests from api/{version}/.
 * End points of this router resolve response by itself.
 */
class MainController {

  /**
   * @description
   */
  private static instance: MainController;

  private constructor() {}

   /**
    * @description
    */
  static get(): MainController {
    if (!MainController.instance) {
      MainController.instance = new MainController();
    }
    return MainController.instance;
  }

  /**
   * @description Ping api
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  async status(req: Request, res: Response, next: () => void): Promise<void> {
    res.status(200);
    res.end();
  }

  /**
   * @description Log CSP report violation. This endpoint is called programmaticaly by helmet.
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  async report(req: Request, res: Response, next: () => void): Promise<void> {
    Logger.log('error', req.body ? `CSP Violation: ${JSON.stringify(req.body)}` : 'CSP Violation');
    res.status(204);
    res.end();
  }

}

const mainController = MainController.get();

export { mainController as MainController }