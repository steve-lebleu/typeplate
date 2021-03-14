import { Request, Response } from 'express';
import { ObjectSchema } from 'joi';

/**
 * @description Custom validation middleware using Joi
 */
const Validate = ( schema: Record<string, ObjectSchema> ) => ( req: Request, res: Response, next: (e?: Error) => void ) : void => {

  const error = ['query', 'body', 'params']
    .filter( (property: string) => schema[property] && req[property])
    .map( (property: string): { error: any } => schema[property].validate(req[property], { abortEarly: true, allowUnknown: true } ) as { error: any })
    .filter(result => result.error)
    .map(result => result.error as Error)
    .slice()
    .shift();

  if (error) {
    return next(error)
  }

  next()
};

export { Validate }