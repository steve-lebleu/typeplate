import { Request, Response } from 'express';
import { notify } from 'node-notifier';
import { notFound } from 'boom';

import { Container } from '@config/container.config';
import { getErrorStatusCode, getErrorOutput } from '@utils/error.util';

/**
 * Error catch/output middleware
 *
 * @dependency libnotify-bin
 * @dependency node-notifier
 *
 * @see https://www.npmjs.com/package/node-notifier
 */
export class Catcher {

  constructor() {}

  /**
   * @description Write errors in a log file
   *
   * @param err Error object
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  static log = (err: Error, req: Request, res: Response, next: Function) => {
    const message =  req.method + ' ' + req.url + ' ' + getErrorStatusCode(err) + ' : ' + err.message + '\n' + err.stack;
    Container.resolve('Logger').log('error', message, { label: 'Application' });
    next(err, req, res, next);
  };

  /**
   * @description Display error in desktop notification
   *
   * @param err Error object
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   *
   * @require libnotify-bin
   * @require node-notifier
   */
  static notification = (err: Error, req: Request, res: Response, next: Function) => {
    const title = 'Error in ' + req.method + ' ' + req.url;
    notify({
      title,
      message : err.message + '\n' + err.stack ? err.stack : ''
    });
    next(err, req, res, next);
  };

  /**
   * @description Display clean error for final user
   *
   * @param err Error object
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  static exit = (err: any, req: Request, res: Response, next: Function) => {
    res.status( getErrorStatusCode(err) );
    res.json( getErrorOutput(err) );
  };

  /**
   * @description Display clean 404 error for final user
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  static notFound = (req: Request, res: Response, next: Function) => {
    res.status( 404 );
    res.json( getErrorOutput( notFound('End point not found') ) );
  };

}