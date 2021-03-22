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
exports.RefreshToken = void 0;
require('module-alias/register');
const typeorm_1 = require("typeorm");
const user_model_1 = require("@models/user.model");
let RefreshToken = class RefreshToken {
    /**
     *
     * @param token
     * @param user
     * @param expires
     */
    constructor(token, user, expires) {
        this.token = token;
        this.expires = expires;
        this.user = user;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], RefreshToken.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], RefreshToken.prototype, "token", void 0);
__decorate([
    typeorm_1.OneToOne(type => user_model_1.User, {
        eager: true,
        onDelete: 'CASCADE' // Remove refresh-token when user is deleted
    }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", user_model_1.User)
], RefreshToken.prototype, "user", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], RefreshToken.prototype, "expires", void 0);
RefreshToken = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [String, user_model_1.User, Date])
], RefreshToken);
exports.RefreshToken = RefreshToken;
