import { Request, Response } from 'express';
import { notify } from 'node-notifier';

import { Logger } from '@services/logger.service';
import { ErrorFactory } from '@factories/error.factory';
import { IHTTPError } from '@interfaces/IHTTPError.interface';

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
   * @description
   *
   * @param err
   * @param req
   * @param res
   * @param next
   */
  static factory = (err: Error, req: Request, res: Response, next: (e: IHTTPError, req, res) => void): void => {
    next(ErrorFactory.get(err), req, res);
  }

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
      message : err.name + '\n' + err.stack ? err.stack : err.message
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
  static log = (err: IHTTPError, req: Request, res: Response, next: (e: IHTTPError, req, res) => void): void => {
    Logger.log('error', `${req.headers['x-forwarded-for'] as string || req.connection.remoteAddress} HTTP/${req.httpVersion} ${err.statusCode} ${req.method} ${req.url} ${err.stack ? '\n' + err.stack : err.errors.slice().shift()}`);
    next(err, req, res);
  };

  /**
   * @description Display clean error for final user
   *
   * @param err Error object
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  static exit = (err: IHTTPError, req: Request, res: Response, next: (e: Error, req, res) => void): void => {
    res.status( err.statusCode );
    res.json( { statusCode: err.statusCode, statusText: err.statusText, errors: err.errors } );
  };

  /**
   * @description Display clean 404 error for final user
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  static notFound = (req: Request, res: Response): void => {
    res.status( 404 );
    res.json( { statusCode: 404, statusText: 'End point not found', errors: [] } );
  };

}