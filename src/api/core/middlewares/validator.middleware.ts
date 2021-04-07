import { Request, Response } from 'express';
import { ObjectSchema } from 'joi';

/**
 * @description
 */
 class Validator {

  /**
   * @description
   */
  private static instance: Validator;

  private constructor() {}

  /**
   * @description
   */
  static get(): Validator {
    if (!Validator.instance) {
      Validator.instance = new Validator();
    }
    return Validator.instance;
  }

  /**
   * @description Custom validation middleware using Joi
   */
  check = ( schema: Record<string, ObjectSchema> ) => ( req: Request, res: Response, next: (e?: Error) => void ) : void => {

    const error = ['query', 'body', 'params']
      .filter( (property: string) => schema[property] && req[property])
      .map( (property: string): { error: any } => schema[property].validate(req[property], { abortEarly: true, allowUnknown: false } ) as { error: any })
      .filter(result => result.error)
      .map(result => result.error as Error)
      .slice()
      .shift();

    if (error) {
      return next(error)
    }

    next()
  }
}

const validator = Validator.get();

export { validator as Validator };