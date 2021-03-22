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
exports.RefreshTokenRepository = void 0;
const typeorm_1 = require("typeorm");
const refresh_token_model_1 = require("@models/refresh-token.model");
const refresh_token_factory_1 = require("@factories/refresh-token.factory");
let RefreshTokenRepository = class RefreshTokenRepository extends typeorm_1.Repository {
    constructor() {
        super();
    }
    /**
     * @description Generate a new refresh token
     *
     * @param user
     */
    generate(user) {
        const refreshToken = refresh_token_factory_1.RefreshTokenFactory.get(user);
        void this.save(refreshToken);
        return refreshToken;
    }
};
RefreshTokenRepository = __decorate([
    typeorm_1.EntityRepository(refresh_token_model_1.RefreshToken),
    __metadata("design:paramtypes", [])
], RefreshTokenRepository);
exports.RefreshTokenRepository = RefreshTokenRepository;
