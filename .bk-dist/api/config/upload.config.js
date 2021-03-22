"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadConfiguration = void 0;
const Multer = require("multer");
const filenamify = require("filenamify");
const boom_1 = require("@hapi/boom");
const environment_config_1 = require("@config/environment.config");
const string_util_1 = require("@utils/string.util");
const _enums_1 = require("@enums");
class UploadConfiguration {
    constructor() {
        /**
         * @description Default options
         */
        this.options = {
            destination: environment_config_1.UPLOAD.PATH,
            maxFiles: environment_config_1.UPLOAD.MAX_FILES,
            filesize: environment_config_1.UPLOAD.MAX_FILE_SIZE,
            wildcards: environment_config_1.UPLOAD.WILDCARDS
        };
        /**
         * @description
         */
        this.engine = Multer;
    }
    /**
     * @description
     */
    static get() {
        if (!UploadConfiguration.instance) {
            UploadConfiguration.instance = new UploadConfiguration();
        }
        return UploadConfiguration.instance;
    }
    /**
     * @description Set Multer instance
     *
     * @param destination Directory where file will be uploaded
     * @param filesize Max file size authorized
     * @param wildcards Array of accepted mime types
     */
    configuration(options) {
        return {
            storage: this.storage(options.destination),
            limits: {
                fileSize: options.filesize
            },
            fileFilter: (req, file, next) => {
                if (options.wildcards.filter(mime => file.mimetype === mime).length === 0) {
                    return next(boom_1.unsupportedMediaType('File mimetype not supported'), false);
                }
                return next(null, true);
            }
        };
    }
    /**
     * @description Set storage config
     * @param destination As main destination
     */
    storage(destination) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return Multer.diskStorage({
            destination: (req, file, next) => {
                let towards = `${destination}/${string_util_1.getTypeOfMedia(file.mimetype)}s`;
                if (_enums_1.IMAGE_MIME_TYPE[file.mimetype]) {
                    towards += `/${environment_config_1.SCALING.PATH_MASTER}`;
                }
                next(null, towards);
            },
            filename: (req, file, next) => {
                const name = filenamify(string_util_1.foldername(file.originalname), { replacement: '-', maxLength: 123 })
                    .replace(' ', '-')
                    .replace('_', '-')
                    .toLowerCase()
                    .concat('-')
                    .concat(Date.now().toString())
                    .concat('.')
                    .concat(string_util_1.extension(file.originalname).toLowerCase());
                next(null, name);
            }
        });
    }
}
const configuration = UploadConfiguration.get();
exports.UploadConfiguration = configuration;
