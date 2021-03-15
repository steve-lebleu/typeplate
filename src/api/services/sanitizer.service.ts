import * as Util from 'util';
import * as Pluralize from 'pluralize';
import { IModel } from '@interfaces/IModel.interface';
import { isObject } from '@utils/object.util';

class SanitizeService {

  /**
   * @description
   */
  private static instance: SanitizeService;

  private constructor() {}

  /**
   * @description
   */
  static get(): SanitizeService {
    if (!SanitizeService.instance) {
      SanitizeService.instance = new SanitizeService();
    }
    return SanitizeService.instance;
  }

  /**
   * @description Whitelist an entity
   *
   * @param whitelist Whitelisted properties
   * @param entity Entity to sanitize
   *
   */
  sanitize(entity: IModel): Record<string, unknown> {
    const output = {} as Record<string, unknown>;
    Object.keys(entity)
      .map( (key) => {
        if (entity.whitelist.includes(key) || entity.whitelist.includes(Pluralize(key))) {
          if( this.isSanitizable( entity[key] ) ) {
            output[key] = Array.isArray(entity[key]) ? [].concat(entity[key]).map( (model: IModel) => this.sanitize(model) ) : this.sanitize(entity[key]);
          } else {
            output[key] = entity[key];
          }
        }
    });
    return output;
  }

  /**
   * @description
   *
   * @param data
   */
  hasEligibleMember(data): boolean {
    return ( this.implementsWhitelist(data) && !Array.isArray(data) ) || ( Array.isArray(data) && [].concat(data).some(obj => this.implementsWhitelist(obj) ) )
  }

  /**
   * @description
   *
   * @param data
   */
  process(data: any) {

    if ( Array.isArray(data) ) {
      return [].concat(data).map( (d: any ) => this.implementsWhitelist(d) ? this.sanitize(d as IModel) : d as Record<string,unknown>);
    }

    if ( this.implementsWhitelist(data) ) {
      return this.sanitize(data as IModel);
    }

    if ( isObject(data) ) {
      return Object.keys(data)
        .reduce( (acc: any, current: string) => {
          acc[current] = this.implementsWhitelist(data[current]) ? this.sanitize(data[current]) : data[current] as Record<string,unknown>
          return acc as Record<string,unknown>;
        }, {}) as Record<string,unknown>;
    }
  }

  /**
   * @description
   *
   * @param obj
   */
  private implementsWhitelist(obj): boolean {
    return isObject(obj) && 'whitelist' in obj;
  }

  /**
   * @description Say if a value can be sanitized
   *
   * @param value Value to check as sanitizable
   */
  private isSanitizable(value: any): boolean {

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
  }
}

const sanitizeService = SanitizeService.get();

export { sanitizeService as SanitizeService }