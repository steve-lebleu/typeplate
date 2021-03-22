"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyRouter = void 0;
const express_1 = require("express");
const main_route_1 = require("@routes/main.route");
const auth_route_1 = require("@routes/auth.route");
const media_route_1 = require("@routes/media.route");
const user_route_1 = require("@routes/user.route");
/**
 * Load all application routes and plug it on main router
 */
class ProxyRouter {
    constructor() {
        /**
         * @decription
         */
        this.router = express_1.Router();
        /**
         * @description Routes descriptions
         */
        this.routes = [
            { segment: '', provider: main_route_1.MainRouter },
            { segment: '/auth/', provider: auth_route_1.AuthRouter },
            { segment: '/medias/', provider: media_route_1.MediaRouter },
            { segment: '/users/', provider: user_route_1.UserRouter }
        ];
    }
    /**
     * @description
     */
    static get() {
        if (!ProxyRouter.instance) {
            ProxyRouter.instance = new ProxyRouter();
        }
        return ProxyRouter.instance;
    }
    /**
     * @description Plug sub routes on main router
     */
    map() {
        this.routes.forEach((route) => {
            const instance = new route.provider();
            this.router.use(route.segment, instance.router);
        });
        return this.router;
    }
}
const proxyRouter = ProxyRouter.get();
exports.ProxyRouter = proxyRouter;
