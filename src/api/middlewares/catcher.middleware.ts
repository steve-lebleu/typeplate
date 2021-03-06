import { Request, Response } from 'express';
import { notify } from 'node-notifier';
import { notFound } from 'boom';

import { Logger } from '@services/logger.service';
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
  static notification = (err: Error, req: Request, res: Response, next: (e: Error, req, res, next) => void): void => {
    notify({
      title: `Error in ${req.method} ${req.url}`,
      message : err.message + '\n' + err.stack ? err.stack : ''
    });
    next(err, req, res, next);
  };

  /**
   * @description Write errors in a log file
   *
   * @param err Error object
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  static log = (err: Error, req: Request, res: Response, next: (e: Error, req, res) => void): void => {
    Logger.log('error', `${req.headers['x-forwarded-for'] as string || req.connection.remoteAddress} HTTP/${req.httpVersion} ${getErrorStatusCode(err)} ${req.method} ${req.url} ${ err.stack ? '\n' + err.stack : getErrorOutput(err).errors.slice().shift() as string }`);
    next(err, req, res);
  };

  /**
   * @description Display clean error for final user
   *
   * @param err Error object
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  static exit = (err: Error, req: Request, res: Response, next: (e: Error, req, res) => void): void => {
    res.status( getErrorStatusCode(err) );
    res.json( getErrorOutput(err) );
  };

  /**
   * @description Display clean 404 error for final user
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  static notFound = (req: Request, res: Response): void => {
    res.status( 404 );
    res.json( getErrorOutput( notFound('End point not found') ) );
  };

}