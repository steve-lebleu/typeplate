import * as Util from 'util';
import * as Pluralize from 'pluralize';
import { IModel } from '@interfaces/IModel.interface';

/**
 * @description Say if a value can be sanitized
 * @param value Value to check as sanitizable
 */
const isSanitizable = (value: any): boolean => {
  const isTypedObject = value !== null && !Util.types.isDate(value) && typeof value !== 'string' && typeof value === 'object' && value.constructor !== Object;
  const cond1 = isTypedObject && value?.constructor !== Array;
  const cond2 = isTypedObject && value?.constructor === Array && value.filter( (entry: any) => typeof entry !== 'string' ).length > 0;
  return cond1 || cond2;
};

/**
 * @description Whitelist an entity
 *
 * @param whitelist Whitelisted properties
 * @param entity Entity to sanitize
 * 
 * TODO: these methods should be work with sanitize middleware. Look to group it
 */
const sanitize = (whitelist: string[], entity: IModel): Record<string, unknown> => {
  const output = {} as Record<string, unknown>;
  Object.keys(entity)
    .map( (key) => {
      if (whitelist.includes(key) || whitelist.includes(Pluralize(key))) {
        if( isSanitizable( entity[key] ) ) {
          output[key] = Array.isArray(entity[key]) ? entity[key].map( (model: IModel) => model.whitelist() ) : entity[key].whitelist();
        } else {
          output[key] = entity[key];
        }
      }
  });
  return output;
};

export { isSanitizable, sanitize }
