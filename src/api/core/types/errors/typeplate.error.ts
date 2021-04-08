/**
 * @description Custom type error
 */
export class TypeplateError extends Error {

  /**
   * @description
   */
  name: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}