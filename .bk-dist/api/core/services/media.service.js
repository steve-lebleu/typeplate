"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const Jimp = require("jimp");
const fs_1 = require("fs");
const es6_promisify_1 = require("es6-promisify");
const boom_1 = require("@hapi/boom");
const environment_config_1 = require("@config/environment.config");
const _enums_1 = require("@enums");
/**
 * @description
 */
class MediaService {
    constructor(config) {
        this.OPTIONS = config;
        this.SIZES = Object.keys(this.OPTIONS.SIZES).map(key => key.toLowerCase());
    }
    /**
     * @description
     */
    static get(config) {
        if (!MediaService.instance) {
            MediaService.instance = new MediaService(config);
        }
        return MediaService.instance;
    }
    /**
     * @description
     *
     * @param media
     */
    rescale(media) {
        if (!this.OPTIONS.IS_ACTIVE) {
            return false;
        }
        void Jimp.read(media.path)
            .then((image) => {
            this.SIZES
                .forEach(size => {
                image
                    .clone()
                    .resize(this.OPTIONS.SIZES[size.toUpperCase()], Jimp.AUTO)
                    .write(`${media.path.split('/').slice(0, -1).join('/').replace(this.OPTIONS.PATH_MASTER, this.OPTIONS.PATH_SCALE)}/${size}/${media.filename}`, (err) => {
                    if (err)
                        throw boom_1.expectationFailed(err.message);
                });
            });
        })
            .catch();
    }
    /**
     * @description
     *
     * @param media
     */
    remove(media) {
        const ulink = es6_promisify_1.promisify(fs_1.unlink);
        if (!_enums_1.IMAGE_MIME_TYPE[media.mimetype] && fs_1.existsSync(media.path.toString())) {
            void ulink(media.path.toString());
        }
        else {
            const promises = this.SIZES
                .map(size => media.path.toString().replace(this.OPTIONS.PATH_MASTER, `${this.OPTIONS.PATH_SCALE}/${size}`))
                .filter(path => fs_1.existsSync(path))
                .map(path => ulink(path));
            void Promise.all([fs_1.existsSync(media.path.toString()) ? ulink(media.path.toString()) : Promise.resolve()].concat(promises));
        }
    }
}
const mediaService = MediaService.get(environment_config_1.SCALING);
exports.MediaService = mediaService;
