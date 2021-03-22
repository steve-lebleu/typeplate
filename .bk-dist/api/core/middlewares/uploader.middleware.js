"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uploader = void 0;
const Pluralize = require("pluralize");
const multer_1 = require("multer");
const environment_config_1 = require("@config/environment.config");
const upload_config_1 = require("@config/upload.config");
const string_util_1 = require("@utils/string.util");
/**
 * @description
 */
class Uploader {
    constructor(options) {
        /**
         * @description Uploader file(s) middleware
         *
         * @param options Uploader parameters (destination, maxFileSize, wildcards)
         *
         * @param req Express request object derived from http.incomingMessage
         * @param res Express response object
         * @param next Callback function
         */
        this.upload = (options) => async (req, res, next) => {
            this.options = options ? Object.keys(options)
                .filter(key => this.options[key])
                .reduce((acc, current) => {
                acc[current] = options[current];
                return acc;
            }, this.options) : this.options;
            if (!req || !res || !this.options) {
                return next(new Error('Middleware requirements not found'));
            }
            const middleware = upload_config_1.UploadConfiguration.engine(upload_config_1.UploadConfiguration.configuration(this.options)).any();
            middleware(req, res, (err) => {
                if (err) {
                    // console.log('ERR', err);
                    return next(err instanceof multer_1.MulterError ? err : new multer_1.MulterError(err.message));
                }
                else if (typeof req.files === 'undefined') {
                    return next(new Error('Binary data cannot be found'));
                }
                req.body.files = req.files
                    .slice(0, this.options.maxFiles)
                    .map((media) => {
                    const type = Pluralize(string_util_1.getTypeOfMedia(media.mimetype));
                    media.owner = req.user.id;
                    media.url = `${type}s/${type === 'image' ? `${environment_config_1.SCALING.PATH_MASTER}/` : ''}${media.filename}`;
                    return media;
                }) || [];
                next();
            });
        };
        this.options = options;
    }
    /**
     * @description
     */
    static get(options) {
        if (!Uploader.instance) {
            Uploader.instance = new Uploader(options);
        }
        return Uploader.instance;
    }
}
const upload = Uploader.get(upload_config_1.UploadConfiguration.options);
exports.Uploader = upload;
