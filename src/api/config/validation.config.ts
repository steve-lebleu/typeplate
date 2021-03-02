import * as ExpressValidation from 'express-validation';

/**
 * Set ExpressValidation default configuration
 */
export class ValidationConfiguration {

  /**
   * @description ExpressValidation constructor
   */
  handler: any;

  /**
   * @description Default options
   */
  private options = {
    allowUnknownBody: true,
    allowUnknownHeaders: false,
    allowUnknownQuery: false,
    allowUnknownParams: false,
    allowUnknownCookies: false,
    status: 400,
    statusText: 'Bad Request',
    contextRequest: false
  };

  constructor() {
    this.handler = ExpressValidation;
    this.handler.options(this.options);
  }

}