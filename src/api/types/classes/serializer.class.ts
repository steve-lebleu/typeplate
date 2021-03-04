import { Request } from 'express';
import { Serializer as JsonApiSerializer } from 'jsonapi-serializer';
import { Deserializer as JsonApiDeserializer } from 'jsonapi-serializer';
import { expectationFailed } from 'boom';

/**
 * Implements json-api serializing / unserializing process
 */
export abstract class Serializer {

  /**
   * @description Object instance type
   */
  protected type;

  /**
   * @description List of authorized fields to include
   */
  protected withelist;

  /**
   * @description Definition of embeded relations
   */
  protected relationships;

  /**
   *
   */
  private serializes: (record) => Record<string, unknown> | Record<string, unknown>[];

  /**
   *
   */
  private deserializes: (record) => Record<string, unknown> | Record<string, unknown>[];

  /**
   * @param type Object instance type
   * @param whitelist List of authorized fields to include
   * @param relations Description of embeded relations
   * @param relationships
   */
  constructor(type: string, whitelist: Array<string>, relations: Record<string, unknown>, relationships: Record<string, unknown>) {

    this.type = type;
    this.withelist = whitelist;
    this.relationships = relationships;

    const serializerOptions = {
      id: 'id',
      attributes: whitelist
    };

    for(const key in relations) {
      serializerOptions[key] = relations[key];
    }

    this.serializes = new JsonApiSerializer(type, serializerOptions).serialize as (record) => Record<string, unknown> | Record<string, unknown>[];

    const deserializerOptions = {
      attributes: whitelist,
      keyForAttribute: 'underscore_case'
    };

    for(const key in relationships) {
      deserializerOptions[key] = relationships[key];
    }

    this.deserializes = new JsonApiDeserializer(deserializerOptions).deserialize as (record) => Record<string, unknown> | Record<string, unknown>[];
  }

  /**
   * @description Serialize an entity for output according to json-api
   *
   * @param payload Data to serialize
   * @throws {Error} Expectation failed (417)
   */
  public serialize = (payload: any|any[]): Record<string, unknown> | Record<string, unknown>[] => {
    try {
      if (Array.isArray(payload)) {
        return payload.map( (entry: Record<string,unknown>) => entry ) ; // FIXME: entry should be this.serializes(entry)
      }
      return this.serializes(payload);
    } catch(e) {
      throw expectationFailed(e.message)
    }
  }

  /**
   * @description Unserialize a payload according to json-api from HTTP request
   *
   * @param req Current request object
   * @throws {Error} Expectation failed (417)
   */
  public deserialize = (req: Request): Record<string,unknown>|Record<string, unknown>[] => {
    try {
      return this.deserializes(req.body);
    } catch (e) {
      throw expectationFailed(e.message);
    }
  }

}