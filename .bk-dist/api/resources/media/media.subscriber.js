"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaSubscriber = void 0;
require('module-alias/register');
const Moment = require("moment-timezone");
const cache_service_1 = require("@services/cache.service");
const typeorm_1 = require("typeorm");
const media_model_1 = require("@models/media.model");
const media_service_1 = require("@services/media.service");
let MediaSubscriber = class MediaSubscriber {
    /**
     * @description Indicates that this subscriber only listen to Media events.
     */
    listenTo() {
        return media_model_1.Media;
    }
    /**
     * @description Called before media insertion.
     */
    beforeInsert(event) {
        event.entity.createdAt = Moment(new Date()).utc(true).toDate();
    }
    /**
     * @description Called after media insertion.
     */
    afterInsert(event) {
        media_service_1.MediaService.rescale(event.entity);
        cache_service_1.CacheService.refresh('medias');
    }
    /**
     * @description Called before media update.
     */
    beforeUpdate(event) {
        event.entity.updatedAt = Moment(new Date()).utc(true).toDate();
    }
    /**
     * @description Called after media update.
     */
    afterUpdate(event) {
        media_service_1.MediaService.rescale(event.entity);
        media_service_1.MediaService.remove(event.databaseEntity);
        cache_service_1.CacheService.refresh('medias');
    }
    /**
     * @description Called after media deletetion.
     */
    afterRemove(event) {
        media_service_1.MediaService.remove(event.entity);
        cache_service_1.CacheService.refresh('medias');
    }
};
MediaSubscriber = __decorate([
    typeorm_1.EventSubscriber()
], MediaSubscriber);
exports.MediaSubscriber = MediaSubscriber;
