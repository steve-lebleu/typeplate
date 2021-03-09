import { Request } from 'express';

import { contentType } from '@config/environment.config';

import { CONTENT_MIME_TYPE } from '@enums/mime-type.enum';
import { IResponse } from '@interfaces/IResponse.interface';
import { IModel } from '@interfaces/IModel.interface'

/**
 * Sanitizing middleware
 */
export class Sanitizer {

  constructor() {}

  /**
   * @description Clean current data before output if the context requires it
   *
   * @param req Express Request instance
   * @param res Express Response instance
   * @param next Callback function
   *
   *  TODO safe decorator ?
   */
  static async whitelist(req: Request, res: IResponse, next: () => void): Promise<void> {

    const hasContent = typeof res.locals.data !== 'undefined';

    if (req.method === 'DELETE' || contentType !== CONTENT_MIME_TYPE['application/json'] || !hasContent) {
      return next();
    }

    if (Array.isArray(res.locals.data)) {
      res.locals.data = res.locals.data.map( (data: { whitelist?: () => Record<string,unknown> } ) => data.whitelist ? data.whitelist() : data );
    } else if (res.locals.data.whitelist) {
      res.locals.data = res.locals.data as IModel;
      res.locals.data = res.locals.data?.whitelist();
    }

    next();
  }

}