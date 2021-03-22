"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const typeorm_1 = require("typeorm");
const user_model_1 = require("@models/user.model");
const user_repository_1 = require("@repositories/user.repository");
const safe_decorator_1 = require("@decorators/safe.decorator");
/**
 * Manage incoming requests for api/{version}/users
 */
class UserController {
    constructor() { }
    /**
     * @description
     */
    static get() {
        if (!UserController.instance) {
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }
    /**
     * @description Get user
     *
     * @param req Express request object derived from http.incomingMessage
     * @param res Express response object
     */
    async get(req, res) {
        const repository = typeorm_1.getCustomRepository(user_repository_1.UserRepository);
        res.locals.data = await repository.one(parseInt(req.params.userId, 10));
    }
    /**
     * @description Get logged in user info
     *
     * @param req Express request object derived from http.incomingMessage
     * @param res Express response object
     */
    async loggedIn(req, res) {
        res.locals.data = new user_model_1.User(req.user);
    }
    /**
     * @description Creates and save new user
     *
     * @param req Express request object derived from http.incomingMessage
     * @param res Express response object
     */
    async create(req, res) {
        const repository = typeorm_1.getRepository(user_model_1.User);
        const user = new user_model_1.User(req.body);
        const savedUser = await repository.save(user);
        res.locals.data = savedUser;
    }
    /**
     * @description Update existing user
     *
     * @param req Express request object derived from http.incomingMessage
     * @param res Express response object
     */
    async update(req, res) {
        const repository = typeorm_1.getRepository(user_model_1.User);
        const user = await repository.findOneOrFail(req.params.userId);
        repository.merge(user, req.body);
        await repository.save(user);
        res.locals.data = user;
    }
    /**
     * @description Get user list
     *
     * @param req Express request object derived from http.incomingMessage
     * @param res Express response object
     */
    async list(req, res) {
        const repository = typeorm_1.getCustomRepository(user_repository_1.UserRepository);
        const users = await repository.list(req.query);
        res.locals.data = users;
    }
    /**
     * @description Delete user
     *
     * @param req Express request object derived from http.incomingMessage
     * @param res Express response object
     */
    async remove(req, res) {
        const repository = typeorm_1.getRepository(user_model_1.User);
        const user = await repository.findOneOrFail(req.params.userId);
        void repository.remove(user);
    }
}
__decorate([
    safe_decorator_1.Safe(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "get", null);
__decorate([
    safe_decorator_1.Safe(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "loggedIn", null);
__decorate([
    safe_decorator_1.Safe(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    safe_decorator_1.Safe(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    safe_decorator_1.Safe(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "list", null);
__decorate([
    safe_decorator_1.Safe(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
const userController = UserController.get();
exports.UserController = userController;
