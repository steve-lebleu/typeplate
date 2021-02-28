import { Router } from 'express';

import { IRoute } from '@interfaces/IRoute.interface';

import { RootRouter } from '@routes/root.route';
import { AuthRouter } from '@routes/auth.route';
import { DocumentRouter } from '@routes/document.route';
import { UserRouter } from '@routes/user.route';

import { Serializer } from '@middlewares/serializer.middleware';

/**
 * Load all application routes and plug it on main router
 */
export class ProxyRouter {

  /**
   * @description Wrapper Express.Router
   */
  public router: Router;

  /**
   * @description Routes descriptions
   */
  private routes = [
    { segment: '', router: RootRouter, serializable: false },
    { segment: '/auth/', router: AuthRouter, serializable: false },
    { segment: '/documents/', router: DocumentRouter, serializable: true },
    { segment: '/users/', router: UserRouter, serializable: true }
  ];

  constructor() {
    this.router = Router();
    this.plug();
  }

  /**
   * @description Plug sub routes on main router
   */
  private plug() {
    this.routes.forEach( (route: IRoute) => {
      const router = new route.router().router;
      const alternatives = route.serializable ? [ router, Serializer.serialize ] : router;
      this.router.use( route.segment, alternatives );
    });
  }

}