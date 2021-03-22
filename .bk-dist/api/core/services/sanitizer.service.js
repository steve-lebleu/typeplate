"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanitizeService = void 0;
const Util = require("util");
const Pluralize = require("pluralize");
const object_util_1 = require("@utils/object.util");
class SanitizeService {
    constructor() { }
    /**
     * @description
     */
    static get() {
        if (!SanitizeService.instance) {
            SanitizeService.instance = new SanitizeService();
        }
        return SanitizeService.instance;
    }
    /**
     * @description
     *
     * @param data
     */
    hasEligibleMember(data) {
        return (this.implementsWhitelist(data) && !Array.isArray(data)) || (Array.isArray(data) && [].concat(data).some(obj => this.implementsWhitelist(obj)) || (object_util_1.isObject(data) && Object.keys(data).some(key => this.implementsWhitelist(data[key]))));
    }
    /**
     * @description
     *
     * @param data
     */
    process(data) {
        if (Array.isArray(data)) {
            return [].concat(data).map((d) => this.implementsWhitelist(d) ? this.sanitize(d) : d);
        }
        if (this.implementsWhitelist(data)) {
            return this.sanitize(data);
        }
        if (object_util_1.isObject(data)) {
            return Object.keys(data)
                .reduce((acc, current) => {
                acc[current] = this.implementsWhitelist(data[current]) ? this.sanitize(data[current]) : data[current];
                return acc;
            }, {});
        }
    }
    /**
     * @description Whitelist an entity
     *
     * @param whitelist Whitelisted properties
     * @param entity Entity to sanitize
     *
     */
    sanitize(entity) {
        const output = {};
        Object.keys(entity)
            .map((key) => {
            if (entity.whitelist.includes(key) || entity.whitelist.includes(Pluralize(key))) {
                output[key] = this.isSanitizable(entity[key]) ? this.sanitize(entity[key]) : entity[key];
            }
        });
        return output;
    }
    /**
     * @description
     *
     * @param obj
     */
    implementsWhitelist(obj) {
        return object_util_1.isObject(obj) && 'whitelist' in obj;
    }
    /**
     * @description Say if a value can be sanitized
     *
     * @param value Value to check as sanitizable
     */
    isSanitizable(value) {
        if (!value) {
            return false;
        }
        if (Util.types.isDate(value) || typeof value === 'string' || typeof value === 'number') {
            return false;
        }
        if (object_util_1.isObject(value) && value.constructor === Object) {
            return false;
        }
        if (object_util_1.isObject(value) && Array.isArray(value) && value.filter((v) => typeof v === 'string' || (object_util_1.isObject(v) && v.constructor === Object)).length > 0) {
            return false;
        }
        return true;
    }
}
const sanitizeService = SanitizeService.get();
exports.SanitizeService = sanitizeService;
