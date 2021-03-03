import { Router } from 'express';

import { IRoute } from '@interfaces/IRoute.interface';

import { RootRouter } from '@routes/root.route';
import { AuthRouter } from '@routes/auth.route';
import { MediaRouter } from '@routes/media.route';
import { UserRouter } from '@routes/user.route';

import { Serializer } from '@middlewares/serializer.middleware';

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
    { segment: '', provider: RootRouter, serializable: false },
    { segment: '/auth/', provider: AuthRouter, serializable: false },
    { segment: '/medias/', provider: MediaRouter, serializable: true },
    { segment: '/users/', provider: UserRouter, serializable: true }
  ];

  constructor() {}

  /**
   * @description Plug sub routes on main router
   */
  static get(): Router {
    if ( !ProxyRouter.instance ) {
      ProxyRouter.instance = Router();
      ProxyRouter.routes.forEach( (route: IRoute) => {
        const router = new route.provider().router;
        ProxyRouter.instance.use( route.segment, route.serializable ? [ router, Serializer.serialize ] : router );
      });
    }
    return ProxyRouter.instance;
  }
}