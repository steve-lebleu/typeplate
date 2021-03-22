"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSubscriber = void 0;
require('module-alias/register');
const Moment = require("moment-timezone");
const typeorm_1 = require("typeorm");
const user_model_1 = require("@models/user.model");
const string_util_1 = require("@utils/string.util");
const cache_service_1 = require("@services/cache.service");
/**
 *
 */
let UserSubscriber = class UserSubscriber {
    /**
     * @description Indicates that this subscriber only listen to Media events.
     */
    listenTo() {
        return user_model_1.User;
    }
    /**
     * @description Called before user insertion.
     */
    beforeInsert(event) {
        event.entity.apikey = string_util_1.encrypt(event.entity.email);
        event.entity.createdAt = Moment(new Date()).utc(true).toDate();
    }
    /**
     * @description Called after media insertion.
     */
    afterInsert(event) {
        cache_service_1.CacheService.refresh('users');
    }
    /**
     * @description Called before user update.
     */
    beforeUpdate(event) {
        event.entity.apikey = string_util_1.encrypt(event.entity.email);
        event.entity.updatedAt = Moment(new Date()).utc(true).toDate();
    }
    /**
     * @description Called after user update.
     */
    afterUpdate(event) {
        cache_service_1.CacheService.refresh('users');
    }
    /**
     * @description Called after user deletetion.
     */
    afterRemove(event) {
        cache_service_1.CacheService.refresh('users');
    }
};
UserSubscriber = __decorate([
    typeorm_1.EventSubscriber()
], UserSubscriber);
exports.UserSubscriber = UserSubscriber;
