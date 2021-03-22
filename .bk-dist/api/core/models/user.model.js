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
exports.User = void 0;
require('module-alias/register');
const Moment = require("moment-timezone");
const Jwt = require("jwt-simple");
const Bcrypt = require("bcrypt");
const typeorm_1 = require("typeorm");
const boom_1 = require("@hapi/boom");
const environment_config_1 = require("@config/environment.config");
const _enums_1 = require("@enums");
const media_model_1 = require("@models/media.model");
let User = class User {
    /**
     * @param payload Object data to assign
     */
    constructor(payload) {
        Object.assign(this, payload);
    }
    storeTemporaryPassword() {
        this.temporaryPassword = this.password;
    }
    async hashPassword() {
        try {
            if (this.temporaryPassword === this.password) {
                return true;
            }
            this.password = await Bcrypt.hash(this.password, 10);
            return true;
        }
        catch (error) {
            throw boom_1.badImplementation(error.message);
        }
    }
    /**
     * @description Check that password matches
     *
     * @param password
     */
    async passwordMatches(password) {
        return await Bcrypt.compare(password, this.password);
    }
    /**
     * @description Generate JWT token
     */
    token() {
        const payload = {
            exp: Moment().add(environment_config_1.JWT.EXPIRATION, 'minutes').unix(),
            iat: Moment().unix(),
            sub: this.id
        };
        return Jwt.encode(payload, environment_config_1.JWT.SECRET);
    }
    /**
     * @description Filter on allowed entity fields
     */
    get whitelist() {
        return [
            'id',
            'username',
            'email',
            'role',
            'createdAt',
            'updatedAt'
        ];
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        length: 32,
        unique: true
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    typeorm_1.Column({
        length: 128,
        unique: true
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({
        length: 128
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({
        length: 64,
        unique: true
    }),
    __metadata("design:type", String)
], User.prototype, "apikey", void 0);
__decorate([
    typeorm_1.Column({
        type: 'enum',
        enum: _enums_1.ROLE,
        default: _enums_1.ROLE.user
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    typeorm_1.OneToMany(() => media_model_1.Media, media => media.owner, {
        eager: true
    }),
    __metadata("design:type", Array)
], User.prototype, "medias", void 0);
__decorate([
    typeorm_1.Column({
        type: Date,
        default: Moment(new Date()).format('YYYY-MM-DD HH:ss')
    }),
    __metadata("design:type", Object)
], User.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column({
        type: Date,
        default: null
    }),
    __metadata("design:type", Object)
], User.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({
        type: Date,
        default: null
    }),
    __metadata("design:type", Object)
], User.prototype, "deletedAt", void 0);
__decorate([
    typeorm_1.AfterLoad(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "storeTemporaryPassword", null);
__decorate([
    typeorm_1.BeforeInsert(),
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPassword", null);
User = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Object])
], User);
exports.User = User;
