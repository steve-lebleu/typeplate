import { Request, Response } from 'express';
import { badData, expectationFailed } from 'boom';

import { getSerializer } from '@utils/serializing.util';
import { APPLICATION_MIME_TYPE } from '@enums/mime-type.enum';

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
  static serialize = async(req: Request, res: Response, next: Function) => {

    try {

      if (req.method === 'DELETE') {
 return next();
}

      // If the res.locals.data property is not found, we get out with an error
      if (!res.locals.data) {
 return next( expectationFailed('Data not found') )
}

      // If we are in mode application/json, we whitelist only as pseudo serializing
      if (process.env.CONTENT_TYPE === APPLICATION_MIME_TYPE['application/json']) {
        res.locals.data = Array.isArray(res.locals.data) ? res.locals.data.map( (data: any) => data.whitelist() ) : res.locals.data.whitelist();
        return next();
      }

      // Retrieve type of entity to serialize
      const typeOf = Array.isArray(res.locals.data) ? res.locals.data[0].constructor : res.locals.data.constructor;

      // Retrieve serializer for current request
      const serializer = getSerializer(typeOf.name);

      // Serialize and set the result on res.locals.data
      res.locals.data = await serializer.serialize(res.locals.data);

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
  static deserialize = async (req: Request, res: Response, next: Function) => {

    // If we are in application/json, we next
    if ( process.env.CONTENT_TYPE === APPLICATION_MIME_TYPE['application/json'] ) {
 return next();
}

    // If method don't have payload, we next
    if ( ['GET', 'DELETE'].includes(req.method) ) {
 return next();
}

    // If method need payload but payload is not found according to vnd.api+json format
    if ( !req.body.data ) {
 return next( badData('Malformed payload: data attribute not found') )
}

    try {
      const serializer = getSerializer(req.body.data[0].type);
      req.body = await serializer.deserialize(req);
      next();
    } catch (e) {
 next( e );
}
  }
}