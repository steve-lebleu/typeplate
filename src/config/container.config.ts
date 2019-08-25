import * as awilix from "awilix";

import { RootController } from "@controllers/root.controller";
import { AuthController } from "@controllers/auth.controller";
import { DocumentController } from "@controllers/document.controller";
import { UserController } from "@controllers/user.controller";

import { AuthProvider } from "@services/auth-provider.service";
import { Can } from "@services/can.service";
import { Logger } from "@services/logger.service";
import { ProxyRouter } from "@services/proxy-router.service";

/**
 * Dependencies container
 */
export class Container {

  /**
   * @description Wrapped awilix container
   */
  private static container: any;

  constructor() {}

  /**
   * @description Creates and fill new awilix container
   */
  private static init(): any {

    this.container = awilix.createContainer({
      injectionMode: awilix.InjectionMode.PROXY
    });

    this.container
      .register({ RootController : awilix.asClass(RootController).singleton() })
      .register({ AuthController : awilix.asClass(AuthController).singleton() })
      .register({ DocumentController : awilix.asClass(DocumentController).singleton() })
      .register({ UserController : awilix.asClass(UserController).singleton() })
      .register({ AuthProvider : awilix.asClass(AuthProvider).singleton() })          
      .register({ Logger : awilix.asClass(Logger).singleton() })   
      .register({ Can : awilix.asClass(Can).singleton() })     
      .register({ ProxyRouter : awilix.asClass(ProxyRouter).singleton() });      

    return this.container;
  }

  /**
   * @description Wrap awilix resolve method
   * 
   * @param {string} instance Name of the class to instanciate
   */
  static resolve(instance: string) {
    if (!this.container) { return this.init().resolve(instance); }
    return this.container.resolve(instance); 
  }
};