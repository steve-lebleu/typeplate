"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const Moment = require("moment-timezone");
const boom_1 = require("@hapi/boom");
const typeorm_1 = require("typeorm");
const environment_config_1 = require("@config/environment.config");
const user_repository_1 = require("@repositories/user.repository");
const refresh_token_repository_1 = require("@repositories/refresh-token.repository");
const user_model_1 = require("@models/user.model");
const refresh_token_model_1 = require("@models/refresh-token.model");
const string_util_1 = require("@utils/string.util");
/**
 * @description
 */
class AuthService {
    constructor() { }
    /**
     * @description
     */
    static get() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }
    /**
     * @description Build a token response and return it
     *
     * @param user
     * @param accessToken
     */
    async generateTokenResponse(user, accessToken) {
        if (!user || !(user instanceof user_model_1.User) || !user.id) {
            return boom_1.badData('User is not an instance of User');
        }
        if (!accessToken) {
            return boom_1.badData('Access token cannot be retrieved');
        }
        const tokenType = 'Bearer';
        const oldToken = await typeorm_1.getRepository(refresh_token_model_1.RefreshToken).findOne({ where: { user } });
        if (oldToken) {
            await typeorm_1.getRepository(refresh_token_model_1.RefreshToken).remove(oldToken);
        }
        const refreshToken = typeorm_1.getCustomRepository(refresh_token_repository_1.RefreshTokenRepository).generate(user).token;
        const expiresIn = Moment().add(environment_config_1.JWT.EXPIRATION, 'minutes');
        return { tokenType, accessToken, refreshToken, expiresIn };
    }
    /**
     * @description Authentication by oAuth processing
     *
     * @param token Access token of provider
     * @param refreshToken Refresh token of provider
     * @param profile Shared profile information
     * @param next Callback function
     *
     * @async
     */
    async oAuth(token, refreshToken, profile, next) {
        try {
            const iRegistrable = {
                id: profile.id,
                username: profile.username ? profile.username : `${profile.name.givenName.toLowerCase()}${profile.name.familyName.toLowerCase()}`,
                email: profile.emails ? profile.emails.filter(email => (email.hasOwnProperty('verified') && email.verified) || !email.hasOwnProperty('verified')).slice().shift().value : `${profile.name.givenName.toLowerCase()}${profile.name.familyName.toLowerCase()}@externalprovider.com`,
                picture: profile.photos.slice().shift()?.value,
                password: string_util_1.hash('email', 16)
            };
            const userRepository = typeorm_1.getCustomRepository(user_repository_1.UserRepository);
            const user = await userRepository.oAuthLogin(iRegistrable);
            return next(null, user);
        }
        catch (err) {
            return next(err, false);
        }
    }
    /**
     * @description Authentication by JWT middleware function
     *
     * @async
     */
    async jwt(payload, next) {
        try {
            const userRepository = typeorm_1.getRepository(user_model_1.User);
            const user = await userRepository.findOne(payload.sub);
            if (user) {
                return next(null, user);
            }
            return next(null, false);
        }
        catch (error) {
            return next(error, false);
        }
    }
}
const authService = AuthService.get();
exports.AuthService = authService;
