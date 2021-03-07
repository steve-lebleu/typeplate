import * as ExpressValidation from 'express-validation';

/**
 * ExpressValidation wrapper as configured middleware
 */
export class Validator {

  /**
   * @description Validation configuration instance
   */
  private static instance: ExpressValidation = null;

  /**
  * @description Default options
  */
  private static options = Object.freeze({
    allowUnknownBody: true,
    allowUnknownHeaders: false,
    allowUnknownQuery: false,
    allowUnknownParams: false,
    allowUnknownCookies: false,
    status: 400,
    statusText: 'Bad Request',
    contextRequest: false
  });

  /**
   * @description ExpressValidation instance
   * @alias ExpressValidation
   */
  static get validate(): ExpressValidation {
    if (!Validator.instance) {
      Validator.instance = ExpressValidation;
      Validator.instance.options(Validator.options);
    }
    return Validator.instance;
  }

  constructor() {}
}