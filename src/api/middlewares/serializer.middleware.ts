import { Request } from 'express';
import { badData, expectationFailed } from 'boom';

import { contentType } from '@config/environment.config';
import { getSerializer } from '@utils/serializing.util';
import { CONTENT_MIME_TYPE } from '@enums/mime-type.enum';
import { IResponse } from '@interfaces/IResponse.interface';
import { IJsonApiRequest } from '@interfaces/IJsonApiRequest.interface';
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
   */
  static serialize = async (req: Request, res: IResponse, next: (error?: Error) => void): Promise<void> => {

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

      // Retrieve type of entity to serialize
      const typeOf = Array.isArray(res.locals.data) ? res.locals.data[0].constructor : res.locals.data.constructor;

      // Retrieve serializer for current request
      const serializer = getSerializer(typeOf.name);

      // Serialize and set the result on res.locals.data
      res.locals.data = serializer.serialize(res.locals.data);

      next();

    } catch (e) {
      next( e );
    }
  }

  /**
   * @description Deserialize current payload if the context requires it
   *
   * @param req Express Request instance
   * @param res Express Response instance
   * @param next Callback function
   */
  static deserialize = async (req: IJsonApiRequest, res: IResponse, next: (error?: Error) => void): Promise<void> => {

    // If we are in application/json, we next
    if (contentType === CONTENT_MIME_TYPE['application/json']) {
      return next();
    }

    // If method don't have payload, we next
    if (['GET', 'DELETE'].includes(req.method)) {
      return next();
    }

    // If method need payload but payload is not found according to vnd.api+json format
    if ( !req.body.data ) {
      return next( badData('Bad formed payload: data attribute not found') )
    }

    try {
      const serializer = getSerializer(req.body.data[0].type);
      req.body = serializer.deserialize(req) as unknown;
      next();
    } catch (e) {
      next( e );
    }
  }
}