import { Request } from 'express';

import { contentType } from '@config/environment.config';

import { CONTENT_MIME_TYPE } from '@enums/mime-type.enum';
import { IResponse } from '@interfaces/IResponse.interface';
import { IModel } from '@interfaces/IModel.interface'

import { sanitize } from '@services/sanitizer.service';

/**
 * @description Clean current data before output if the context requires it
 *
 * @param req Express Request instance
 * @param res Express Response instance
 * @param next Callback function
 *
 *  TODO safe decorator on this middleware and each other
 */
const Sanitizer = async (req: Request, res: IResponse, next: () => void): Promise<void>  => {

  const hasContent = typeof res.locals.data !== 'undefined';

  if (req.method === 'DELETE' || contentType !== CONTENT_MIME_TYPE['application/json'] || !hasContent) {
    return next();
  }

  if (Array.isArray(res.locals.data)) {
    res.locals.data = res.locals.data.map( (data: { whitelist?: string[] } ) => data.whitelist ? sanitize(data as IModel) : data );
  } else if (res.locals.data.whitelist) {
    res.locals.data = sanitize(res.locals.data as IModel);
  }

  next();
}

export { Sanitizer }