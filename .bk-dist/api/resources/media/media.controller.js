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
exports.MediaController = void 0;
const typeorm_1 = require("typeorm");
const lodash_1 = require("lodash");
const safe_decorator_1 = require("@decorators/safe.decorator");
const media_repository_1 = require("@repositories/media.repository");
const media_model_1 = require("@models/media.model");
/**
 * Manage incoming requests for api/{version}/medias
 */
class MediaController {
    constructor() { }
    /**
     * @description
     */
    static get() {
        if (!MediaController.instance) {
            MediaController.instance = new MediaController();
        }
        return MediaController.instance;
    }
    /**
     * @description Retrieve one document according to :documentId
     *
     * @param req Express request object derived from http.incomingMessage
     * @param res Express response object
     *
     * @public
     */
    async get(req, res) {
        const repository = typeorm_1.getRepository(media_model_1.Media);
        const media = await repository.findOneOrFail(req.params.mediaId, { relations: ['owner'] });
        res.locals.data = media;
    }
    /**
     * @description Retrieve a list of documents, according to some parameters
     *
     * @param req Express request object derived from http.incomingMessage
     * @param res Express response object
     */
    async list(req, res) {
        const repository = typeorm_1.getCustomRepository(media_repository_1.MediaRepository);
        const medias = await repository.list(req.query);
        res.locals.data = medias;
    }
    /**
     * @description Create a new document
     *
     * @param req Express request object derived from http.incomingMessage
     * @param res Express response object
     *
     * @public
     */
    async create(req, res) {
        const repository = typeorm_1.getRepository(media_model_1.Media);
        const medias = [].concat(req.files).map((file) => new media_model_1.Media(file));
        await repository.save(medias);
        res.locals.data = medias;
    }
    /**
     * @description Update one document according to :documentId
     *
     * @param req Express request object derived from http.incomingMessage
     * @param res Express response object
     *
     * @public
     */
    async update(req, res) {
        const repository = typeorm_1.getRepository(media_model_1.Media);
        const media = lodash_1.clone(res.locals.data);
        repository.merge(media, req.files[0]);
        await repository.save(media);
        res.locals.data = media;
    }
    /**
     * @description Delete one document according to :documentId
     *
     * @param req Express request object derived from http.incomingMessage
     * @param res Express response object
     *
     * @public
     */
    async remove(req, res) {
        const repository = typeorm_1.getRepository(media_model_1.Media);
        const media = lodash_1.clone(res.locals.data);
        await repository.remove(media);
    }
}
__decorate([
    safe_decorator_1.Safe(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "get", null);
__decorate([
    safe_decorator_1.Safe(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "list", null);
__decorate([
    safe_decorator_1.Safe(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "create", null);
__decorate([
    safe_decorator_1.Safe(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "update", null);
__decorate([
    safe_decorator_1.Safe(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "remove", null);
const mediaController = MediaController.get();
exports.MediaController = mediaController;
