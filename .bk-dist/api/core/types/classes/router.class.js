"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const express_1 = require("express");
/**
 * Router base class
 */
class Router {
    constructor() {
        /**
         * @description Wrapped Express.Router
         */
        this.router = null;
        this.router = express_1.Router();
        this.define();
    }
    define() { }
}
exports.Router = Router;
