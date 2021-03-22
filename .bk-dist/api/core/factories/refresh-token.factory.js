"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenFactory = void 0;
const Moment = require("moment-timezone");
const crypto_1 = require("crypto");
const refresh_token_model_1 = require("@models/refresh-token.model");
const environment_config_1 = require("@config/environment.config");
/**
 * @description
 */
class RefreshTokenFactory {
    /**
     * @description
     *
     * @param user
     */
    static get(user) {
        const token = `${user.id}.${crypto_1.randomBytes(40).toString('hex')}`;
        const expires = Moment().add(environment_config_1.REFRESH_TOKEN.DURATION, environment_config_1.REFRESH_TOKEN.UNIT).toDate();
        return new refresh_token_model_1.RefreshToken(token, user, expires);
    }
}
exports.RefreshTokenFactory = RefreshTokenFactory;
