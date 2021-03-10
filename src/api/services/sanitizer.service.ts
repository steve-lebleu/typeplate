import * as Util from 'util';
import * as Pluralize from 'pluralize';
import { IModel } from '@interfaces/IModel.interface';

const isObject = (val) => typeof val === 'object';

/**
 * @description Say if a value can be sanitized
 * @param value Value to check as sanitizable
 */
const isSanitizable = (value: any): boolean => {

  if ( !value ) {
    return false;
  }

  if ( Util.types.isDate(value) || typeof value === 'string' || typeof value === 'number') {
    return false;
  }

  if ( isObject(value) && value.constructor === Object ) {
    return false;
  }

  if ( isObject(value) && Array.isArray(value) && value.filter( (v) => typeof v === 'string' || ( isObject(v) && v.constructor === Object ) ).length > 0 ) {
    return false;
  }

  return true;
};

/**
 * @description Whitelist an entity
 *
 * @param whitelist Whitelisted properties
 * @param entity Entity to sanitize
 *
 */
const sanitize = (entity: IModel): Record<string, unknown> => {
  const output = {} as Record<string, unknown>;
  Object.keys(entity)
    .map( (key) => {
      if (entity.whitelist.includes(key) || entity.whitelist.includes(Pluralize(key))) {
        if( isSanitizable( entity[key] ) ) {
          output[key] = Array.isArray(entity[key]) ? entity[key].map( (model: IModel) => sanitize(model) ) : sanitize(entity[key]);
        } else {
          output[key] = entity[key];
        }
      }
  });
  return output;
};

export { isSanitizable, sanitize }