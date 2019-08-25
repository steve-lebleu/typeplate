import * as Helmet from "helmet";

/**
 * Set Helmet security middleware
 * 
 * @see https://github.com/helmetjs/helmet
 */
export class HelmetConfiguration {

  /**
   * @description Wrapped Helmet instance
   */
  private static helmet: Function;

  /**
   * @description Plugins options. Add options to activate a specific plugin.
   */
  private static options = {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "'api.mail.konfer.be'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        sandbox: ['allow-forms', 'allow-scripts'],
        reportUri: '/report-violation',
        objectSrc: ["'none'"],
        upgradeInsecureRequests: true,
        workerSrc: false  // This is not set.
      }
    },
    referrerPolicy: { policy: 'no-referrer' }
  };

  constructor() {}

  /**
   * @description Set plugins according to scope options
   */
  private static plug(): Function {
    this.helmet = Helmet;
    Object.keys(this.options).forEach( key => {
      this.helmet[key](this.options[key]);
    });
    return this.helmet;
  }

  /**
   * @description Helmet instance getter as Singleton
   */
  static get(): Function {
    if (!this.helmet) { return this.plug(); }
    return this.helmet;
  }

};