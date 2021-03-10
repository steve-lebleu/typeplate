import { Router } from 'express';

import { IRoute } from '@interfaces/IRoute.interface';

import { MainRouter } from '@routes/main.route';
import { AuthRouter } from '@routes/auth.route';
import { MediaRouter } from '@routes/media.route';
import { UserRouter } from '@routes/user.route';

/**
 * Load all application routes and plug it on main router
 */
export class ProxyRouter {

  /**
   * @description Wrapper Express.Router
   */
  private static instance?: Router = null;

  /**
   * @description Routes descriptions
   */
  private static routes = [
    { segment: '', provider: MainRouter },
    { segment: '/auth/', provider: AuthRouter },
    { segment: '/medias/', provider: MediaRouter },
    { segment: '/users/', provider: UserRouter }
  ];

  constructor() {}

  /**
   * @description Pseudo singleton
   */
  static get(): Router {
    if ( !ProxyRouter.instance ) {
      ProxyRouter.instance = Router();
    }
    return ProxyRouter.instance;
  }

  /**
   * @description Plug sub routes on main router
   */
  static map(): Router {
    ProxyRouter.routes.forEach( (route: IRoute) => {
      const instance = new route.provider() as { router: Router };
      ProxyRouter.instance.use( route.segment, instance.router );
    });
    return ProxyRouter.instance;
  }
}

ProxyRouter.get();