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
exports.MediaRepository = void 0;
const typeorm_1 = require("typeorm");
const lodash_1 = require("lodash");
const media_model_1 = require("@models/media.model");
const string_util_1 = require("@utils/string.util");
let MediaRepository = class MediaRepository extends typeorm_1.Repository {
    /** */
    constructor() {
        super();
    }
    /**
     * @description Get a list of files according to current query
     */
    async list({ page = 1, perPage = 30, path, fieldname, filename, size, mimetype, owner, type }) {
        const repository = typeorm_1.getRepository(media_model_1.Media);
        const options = lodash_1.omitBy({ path, fieldname, filename, size, mimetype, owner, type }, lodash_1.isNil);
        const query = repository
            .createQueryBuilder('media')
            .leftJoinAndSelect('media.owner', 'u');
        if (options.fieldname) {
            query.andWhere('fieldname = :fieldname', { fieldname: options.fieldname });
        }
        if (options.filename) {
            query.andWhere('filename LIKE :filename', { filename: `%${options.filename}%` });
        }
        if (options.mimetype) {
            query.andWhere('mimetype LIKE :mimetype', { mimetype: `%${options.mimetype}%` });
        }
        if (options.type) {
            query.andWhere('mimetype IN (:mimetypes)', { mimetypes: string_util_1.getMimeTypesOfType(options.type) });
        }
        if (options.size) {
            query.andWhere('size >= :size', { size: `%${options.size}%` });
        }
        return query
            .skip((page - 1) * perPage)
            .take(perPage)
            .getMany();
    }
};
MediaRepository = __decorate([
    typeorm_1.EntityRepository(media_model_1.Media),
    __metadata("design:paramtypes", [])
], MediaRepository);
exports.MediaRepository = MediaRepository;
