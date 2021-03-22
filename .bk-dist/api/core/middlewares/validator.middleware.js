"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
/**
 * @description
 */
class Validator {
    constructor() {
        /**
         * @description Custom validation middleware using Joi
         */
        this.check = (schema) => (req, res, next) => {
            const error = ['query', 'body', 'params']
                .filter((property) => schema[property] && req[property])
                .map((property) => schema[property].validate(req[property], { abortEarly: true, allowUnknown: true }))
                .filter(result => result.error)
                .map(result => result.error)
                .slice()
                .shift();
            if (error) {
                return next(error);
            }
            next();
        };
    }
    /**
     * @description
     */
    static get() {
        if (!Validator.instance) {
            Validator.instance = new Validator();
        }
        return Validator.instance;
    }
}
const validator = Validator.get();
exports.Validator = validator;
