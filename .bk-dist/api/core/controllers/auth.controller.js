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
exports.AuthController = void 0;
const typeorm_1 = require("typeorm");
const boom_1 = require("@hapi/boom");
const user_model_1 = require("@models/user.model");
const refresh_token_model_1 = require("@models/refresh-token.model");
const user_repository_1 = require("@repositories/user.repository");
const auth_service_1 = require("@services/auth.service");
const safe_decorator_1 = require("@decorators/safe.decorator");
/**
 * Manage incoming requests from api/{version}/auth
 */
class AuthController {
    constructor() { }
    /**
     * @description
     */
    static get() {
        if (!AuthController.instance) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
    }
    /**
     * @description Creates and save new user
     *
     * @param req Express request object derived from http.incomingMessage
     * @param res Express response object
     */
    async register(req, res) {
        const repository = typeorm_1.getRepository(user_model_1.User);
        const user = new user_model_1.User(req.body);
        await repository.insert(user);
        const token = await auth_service_1.AuthService.generateTokenResponse(user, user.token());
        res.locals.data = { token, user };
    }
    /**
     * @description Login with an existing user or creates a new one if valid accessToken token
     *
     * @param req Express request object derived from http.incomingMessage
     * @param res Express response object
     */
    async login(req, res) {
        const repository = typeorm_1.getCustomRepository(user_repository_1.UserRepository);
        const { user, accessToken } = await repository.findAndGenerateToken(req.body);
        const token = await auth_service_1.AuthService.generateTokenResponse(user, accessToken);
        res.locals.data = { token, user };
    }
    /**
     * @description Login with an existing user or creates a new one if valid accessToken token
     *
     * @param req Express request object derived from http.incomingMessage
     * @param res Express response object
     */
    async oAuth(req, res) {
        const user = req.user;
        const accessToken = user.token();
        const token = await auth_service_1.AuthService.generateTokenResponse(user, accessToken);
        res.locals.data = { token, user };
    }
    /**
     * @description Refresh JWT token by RefreshToken removing, and re-creating
     *
     * @param req Express request object derived from http.incomingMessage
     * @param res Express response object
     */
    async refresh(req, res, next) {
        const refreshTokenRepository = typeorm_1.getRepository(refresh_token_model_1.RefreshToken);
        const userRepository = typeorm_1.getCustomRepository(user_repository_1.UserRepository);
        const { token } = req.body;
        const refreshToken = await refreshTokenRepository.findOne({
            where: { token: token.refreshToken }
        });
        if (typeof (refreshToken) === 'undefined') {
            return next(boom_1.notFound('RefreshToken not found'));
        }
        await refreshTokenRepository.remove(refreshToken);
        // Get owner user of the token
        const { user, accessToken } = await userRepository.findAndGenerateToken({ email: refreshToken.user.email, refreshToken });
        const response = await auth_service_1.AuthService.generateTokenResponse(user, accessToken);
        res.locals.data = { token: response };
    }
}
__decorate([
    safe_decorator_1.Safe(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    safe_decorator_1.Safe(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    safe_decorator_1.Safe(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "oAuth", null);
__decorate([
    safe_decorator_1.Safe(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
const authController = AuthController.get();
exports.AuthController = authController;
