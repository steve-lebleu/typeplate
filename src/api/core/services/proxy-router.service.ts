import { Router } from 'express';

import { IRoute } from '@interfaces';

import { MainRouter } from '@routes/main.route';
import { AuthRouter } from '@routes/auth.route';
import { MediaRouter } from '@routes/media.route';
import { UserRouter } from '@routes/user.route';

/**
 * Load all application routes and plug it on main router
 */
class ProxyRouter {

  /**
   * @description Wrapper Express.Router
   */
  private static instance: ProxyRouter;

  /**
   * @decription
   */
  private router: Router = Router();

  /**
   * @description Routes descriptions
   */
  private readonly routes = [
    { segment: '', provider: MainRouter },
    { segment: '/auth/', provider: AuthRouter },
    { segment: '/medias/', provider: MediaRouter },
    { segment: '/users/', provider: UserRouter }
  ];

  private constructor() {}

  /**
   * @description
   */
  static get(): ProxyRouter {
    if ( !ProxyRouter.instance ) {
      ProxyRouter.instance = new ProxyRouter();
    }
    return ProxyRouter.instance;
  }

  /**
   * @description Plug sub routes on main router
   */
  map(): Router {
    this.routes.forEach( (route: IRoute) => {
      const instance = new route.provider() as { router: Router };
      this.router.use( route.segment, instance.router );
    });
    return this.router;
  }
}

const proxyRouter = ProxyRouter.get();

export { proxyRouter as ProxyRouter }