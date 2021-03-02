import { Serializer } from '@bases/serializer.class';
import { UserSerializer } from '@serializers/user.serializer';
import { MediaSerializer } from '@serializers/media.serializer';
import { isDate, isNull, isString } from 'util';
import * as Pluralize from 'pluralize';
import { IModelize } from '@interfaces/IModelize.interface';

/**
 * @description Say if a value can be serialized
 * @param value Value to check as serializable
 */
const isSerializable = (value: any): boolean => {
  const typeOf = typeof(value);
  const isTypedObject = !isNull(value) && !isDate(value) && !isString(value) && typeOf === 'object' && value.constructor !== Object;
  const cond1 = isTypedObject && value.constructor !== Array;
  const cond2 = isTypedObject && value.constructor === Array && value.filter( (entry: any) => typeof entry !== 'string' ).length > 0;
  return cond1 || cond2;
};

/**
 * @description Whitelist an entity when Content-Type is application/json
 * @param whitelist Whitelisted properties
 * @param entity Entity to serialize
 */
const filter = (whitelist: string[], entity: IModelize): IModelize => {
  const obj = {} as any;
  Object.keys(entity).map( (key) => {
    if (whitelist.includes(key) || whitelist.includes(Pluralize(key))) {
      if( isSerializable( entity[key] ) ) {
        obj[key] = Array.isArray(entity[key]) ? entity[key].map( (model: any) => model.whitelist() ) : entity[key].whitelist();
      } else {
        obj[key] = entity[key];
      }
    }
  });
  return obj;
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
    case 'Document':
    case 'documents':
      serializer = new MediaSerializer();
    break;
  }
  if (serializer === null) {
    throw new TypeError(`Serializer for ${name} cannot be instancied`);
  }
  return serializer;
};

export { getSerializer, filter }
