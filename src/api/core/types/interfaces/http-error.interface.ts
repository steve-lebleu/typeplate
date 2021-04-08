/**
 * Define error output format
 */
export interface IHTTPError {

  /**
   * @description HTTP response status code
   */
  statusCode: number;

  /**
   * @description HTTP response status message
   */
  statusText: string;

  /**
   * @description HTTP response errors
   */
  errors: Array<string>;


  /**
   *
   */
  message?: string;

  /**
   *
   */
  stack?: string;
}