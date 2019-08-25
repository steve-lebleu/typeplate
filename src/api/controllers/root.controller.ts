import { Request, Response } from "express";
import { OK } from "http-status";
import { Container } from "@config/container.config";
import { Controller } from "@bases/controller.class";

/**
 * Manage incoming requests from api/{version}/.
 * End points of this router resolve response by itself.
 */
export class RootController extends Controller {

  constructor() { super(); }

  /**
   * @description Ping api
   * 
   * @param {Request} req Express request object derived from http.incomingMessage
   * @param {Response} res Express response object
   * @param {Function} next Callback function
   */
  status = (req: Request, res: Response, next: Function) => { 
    res.status(OK); 
    res.end(); 
  };

  /**
   * @description Log CSP report violation. This end point is called programmaticaly by helmet.
   * 
   * @param {Request} req Express request object derived from http.incomingMessage
   * @param {Response} res Express response object
   * @param {Function} next Callback function
   */
  report = (req: Request, res: Response, next: Function) => {
    const message = req.body ? 'CSP Violation: ' + req.body : 'CSP Violation';
    Container.resolve('Logger').log('error', message, { label: 'CSP violation' });
    res.status(OK);
    res.end();
  };

}