/**
 * Define generic Error interface
 */
export interface IError {

  /**
   * @description MySQL error status code
   */
  errno?: number;

  /**
   * @description MySQL error message
   */
  sqlMessage?: string;

  /**
   * @description Error name
   */
  name: string;

  /**
   * @description Error message
   */
  message?: string;

  /**
   * @description Error call stack
   */
  stack?: string;
}