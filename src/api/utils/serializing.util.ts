import { Serializer } from '@bases/serializer.class';
import { UserSerializer } from '@serializers/user.serializer';
import { MediaSerializer } from '@serializers/media.serializer';
import * as Util from 'util';
import * as Pluralize from 'pluralize';
import { IModel } from '@interfaces/IModel.interface';

/**
 * @description Say if a value can be serialized
 * @param value Value to check as serializable
 */
const isSanitizable = (value: any): boolean => {
  const isTypedObject = value !== null && !Util.types.isDate(value) && typeof value !== 'string' && typeof value === 'object' && value.constructor !== Object;
  const cond1 = isTypedObject && value.constructor !== Array;
  const cond2 = isTypedObject && value.constructor === Array && value.filter( (entry: any) => typeof entry !== 'string' ).length > 0;
  return cond1 || cond2;
};

/**
 * @description Whitelist an entity when Content-Type is application/json
 *
 * @param whitelist Whitelisted properties
 * @param entity Entity to serialize
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

/**
 * @description Get a serializer according to current request
 * @param name
 * TODO: no hardcode
 */
const getSerializer = (name: string): Serializer => {
  let serializer = null;
  switch(name) {
    case 'User':
    case 'users':
      serializer = new UserSerializer();
    break;
    case 'Media':
    case 'medias':
      serializer = new MediaSerializer();
    break;
  }
  if (serializer === null) {
    throw new TypeError(`Serializer for ${name} cannot be instancied`);
  }
  return serializer;
};

export { getSerializer, sanitize }
