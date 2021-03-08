import { Request, Response } from 'express';
import { ObjectSchema } from 'joi';

/**
 * Custom validator using Joi
 */
export class Validator {

  /**
   * @description Default options
   */
  private static options = Object.freeze({
    allowUnknownBody: true,
    allowUnknownHeaders: false,
    allowUnknownQuery: false,
    allowUnknownParams: false,
    allowUnknownCookies: false,
    status: 400,
    statusText: 'Bad Request',
    contextRequest: false
  });

  constructor() {}

  /**
   * @description Validate schema
   *
   * @param schema
   */
  static validate = ( schema: Record<string, ObjectSchema> ) => ( req: Request, res: Response, next: (e?: Error) => void ) : void => {

    const error = ['query', 'body', 'params']
      .filter( (property: string) => schema[property] && req[property])
      .map( (property: string): { error: any } => schema[property].validate(req[property], { allowUnknown: true } ) as { error: any })
      .filter(result => result.error)
      .map(result => result.error as Error)
      .slice()
      .shift();

    if (error) {
      return next(error)
    }

    next()
  };
}