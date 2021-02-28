import { ValidationConfiguration } from '@config/validation.config';

/**
 * ExpressValidation wrapper as configured middleware
 */
export class Validator {

  /**
   * @description Validation configuration instance
   */
  private static configuration = new ValidationConfiguration();

  /**
   * @description ExpressValidation instance
   * @alias ExpressValidation
   */
  static validate = Validator.configuration.handler;

  constructor() {}
}