/**
 * Define field error format
 */
export interface IFieldError {

  /**
   * @description Field name|path
   */
  field: string;

  /**
   * @description Error type
   */
  types?: string[];

  /**
   * @description Error message(s)
   */
  messages: string|string[];

  /**
   * @description Help link
   */
  help?: string;
}