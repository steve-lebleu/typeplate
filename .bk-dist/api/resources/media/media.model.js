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
exports.Media = void 0;
require('module-alias/register');
const Moment = require("moment");
const typeorm_1 = require("typeorm");
const _enums_1 = require("@enums");
const user_model_1 = require("@models/user.model");
let Media = class Media {
    /**
     * @param payload Object data to assign
     */
    constructor(payload) {
        Object.assign(this, payload);
    }
    /**
     * @description Filter on allowed entity fields
     */
    get whitelist() {
        return [
            'id',
            'fieldname',
            'filename',
            'path',
            'mimetype',
            'url',
            'size',
            'createdAt',
            'updatedAt',
            'owner'
        ];
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Media.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        type: String,
        length: 32
    }),
    __metadata("design:type", Object)
], Media.prototype, "fieldname", void 0);
__decorate([
    typeorm_1.Column({
        type: String,
        length: 128
    }),
    __metadata("design:type", Object)
], Media.prototype, "filename", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Media.prototype, "path", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Media.prototype, "url", void 0);
__decorate([
    typeorm_1.Column({
        type: 'enum',
        enum: _enums_1.MIME_TYPE
    }),
    __metadata("design:type", String)
], Media.prototype, "mimetype", void 0);
__decorate([
    typeorm_1.Column({
        type: Number
    }),
    __metadata("design:type", Object)
], Media.prototype, "size", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_model_1.User, user => user.medias, {
        onDelete: 'CASCADE' // Remove all documents when user is deleted
    }),
    __metadata("design:type", user_model_1.User)
], Media.prototype, "owner", void 0);
__decorate([
    typeorm_1.Column({
        type: Date,
        default: Moment(new Date()).format('YYYY-MM-DD HH:ss')
    }),
    __metadata("design:type", Object)
], Media.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column({
        type: Date,
        default: null
    }),
    __metadata("design:type", Object)
], Media.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({
        type: Date,
        default: null
    }),
    __metadata("design:type", Object)
], Media.prototype, "deletedAt", void 0);
Media = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Object])
], Media);
exports.Media = Media;
