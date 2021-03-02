import { Serializer } from '@bases/serializer.class';
import { UserSerializer } from '@serializers/user.serializer';
import { DocumentSerializer } from '@serializers/document.serializer';
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
      serializer = new DocumentSerializer();
    break;
  }
  if (serializer === null) {
    throw new TypeError(`Serializer for ${name} cannot be instancied`);
  }
  return serializer;
};

const example = {
  links: {
    self: 'http://example.com/articles',
    next: 'http://example.com/articles?page[offset]=2',
    last: 'http://example.com/articles?page[offset]=10'
  },
  data: [{
    type: 'articles',
    id: '1',
    attributes: {
      title: 'JSON:API paints my bikeshed!'
    },
    relationships: {
      author: {
        links: {
          self: 'http://example.com/articles/1/relationships/author',
          related: 'http://example.com/articles/1/author'
        },
        data: { type: 'people', id: '9' }
      },
      comments: {
        links: {
          self: 'http://example.com/articles/1/relationships/comments',
          related: 'http://example.com/articles/1/comments'
        },
        data: [
          { type: 'comments', id: '5' },
          { type: 'comments', id: '12' }
        ]
      }
    },
    links: {
      self: 'http://example.com/articles/1'
    }
  }],
  included: [{
    type: 'people',
    id: '9',
    attributes: {
      firstName: 'Dan',
      lastName: 'Gebhardt',
      twitter: 'dgeb'
    },
    links: {
      self: 'http://example.com/people/9'
    }
  }, {
    type: 'comments',
    id: '5',
    attributes: {
      body: 'First!'
    },
    relationships: {
      author: {
        data: { type: 'people', id: '2' }
      }
    },
    links: {
      self: 'http://example.com/comments/5'
    }
  }, {
    type: 'comments',
    id: '12',
    attributes: {
      body: 'I like XML better'
    },
    relationships: {
      author: {
        data: { type: 'people', id: '9' }
      }
    },
    links: {
      self: 'http://example.com/comments/12'
    }
  }]
};

export { getSerializer, filter }
