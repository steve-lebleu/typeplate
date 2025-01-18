import { Router } from '@classes';

/**
 * Define route definition members
 */
export interface IRoute {

  /**
   * @description URI segment
   */
  segment: string;

  /**
   * @description Router definition or Router concrete instance
   */
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  provider: Router|any;

  /**
   * @description Indicates if the route response must be serialized
   */
  serializable: boolean;
}