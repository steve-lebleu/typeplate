import { Router as ExpressRouter } from 'express';

/**
 * Router base class
 */
export abstract class Router {

  /**
   * @description Wrapped Express.Router
   */
  router: ExpressRouter = null;

  constructor() {
    this.router = ExpressRouter();
    this.define();
  }

  /**
   * @description Plug routes definitions
   */
  protected define(): void {}
}