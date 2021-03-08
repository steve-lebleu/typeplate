import { Request } from 'express';
import { expectationFailed } from '@hapi/boom';

import { contentType } from '@config/environment.config';

import { CONTENT_MIME_TYPE } from '@enums/mime-type.enum';
import { IResponse } from '@interfaces/IResponse.interface';

import { IModel } from '@interfaces/IModel.interface';

/**
 * Serializing middleware
 */
export class Serializer {

  constructor() {}

  /**
   * @description Serialize current data before output if the context requires it
   *
   * @param req Express Request instance
   * @param res Express Response instance
   * @param next Callback function
   *
   * TDOD: use safe decorator
   */
  static async serialize (req: Request, res: IResponse, next: (error?: Error) => void): Promise<void> {

    try {

      if (req.method === 'DELETE') {
        return next();
      }

      // If the res.locals.data property is not found, we get out with an error
      if (!res.locals.data) {
        return next( expectationFailed('Data not found') )
      }

      // If we are in mode application/json, we whitelist only as pseudo serializing
      if (contentType === CONTENT_MIME_TYPE['application/json']) {
        if (Array.isArray(res.locals.data)) {
          res.locals.data = res.locals.data.map( (data: { whitelist: () => Record<string,unknown> } ) => data.whitelist() );
        } else {
          res.locals.data = res.locals.data as IModel;
          res.locals.data = res.locals.data.whitelist();
        }
        return next();
      }

      next();

    } catch (e) {
      next( e );
    }
  }

}