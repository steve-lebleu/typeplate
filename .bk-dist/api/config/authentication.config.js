"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authentication = void 0;
const passport_1 = require("passport");
const passport_jwt_1 = require("passport-jwt");
const passport_facebook_1 = require("passport-facebook");
const passport_google_oauth_1 = require("passport-google-oauth");
const passport_github2_1 = require("passport-github2");
const passport_linkedin_oauth2_1 = require("passport-linkedin-oauth2");
const environment_config_1 = require("@config/environment.config");
const auth_service_1 = require("@services/auth.service");
const ExtractJwtAlias = passport_jwt_1.ExtractJwt;
/**
 * Authentication configuration
 */
class Authentication {
    constructor() {
        /**
         * @description Default options
         */
        this.options = {
            jwt: {
                secretOrKey: environment_config_1.JWT.SECRET,
                jwtFromRequest: ExtractJwtAlias.fromAuthHeaderWithScheme('Bearer')
            }
        };
    }
    /**
     * @description Authentication singleton getter
     */
    static get() {
        if (!Authentication.instance) {
            Authentication.instance = new Authentication();
        }
        return Authentication.instance;
    }
    /**
     * @description Wrap passport method
     */
    initialize() {
        return passport_1.initialize();
    }
    /**
     * @description Enable available auth strategies
     */
    plug() {
        passport_1.use(this.factory('jwt'));
        [environment_config_1.FACEBOOK, environment_config_1.GITHUB, environment_config_1.GOOGLE, environment_config_1.LINKEDIN]
            .filter(provider => provider.IS_ACTIVE)
            .forEach(provider => {
            passport_1.use(this.factory(provider.KEY));
        });
    }
    /**
     * @description Provide a passport strategy instance
     *
     * @param strategy Strategy to instanciate
     */
    factory(strategy) {
        switch (strategy) {
            case 'jwt':
                return new passport_jwt_1.Strategy(this.options.jwt, auth_service_1.AuthService.jwt);
            case 'facebook':
                return new passport_facebook_1.Strategy({
                    clientID: environment_config_1.FACEBOOK.ID,
                    clientSecret: environment_config_1.FACEBOOK.SECRET,
                    callbackURL: environment_config_1.FACEBOOK.CALLBACK_URL,
                    profileFields: ['id', 'link', 'email', 'name', 'picture', 'address']
                }, auth_service_1.AuthService.oAuth);
            case 'google':
                return new passport_google_oauth_1.OAuth2Strategy({
                    clientID: environment_config_1.GOOGLE.ID,
                    clientSecret: environment_config_1.GOOGLE.SECRET,
                    callbackURL: environment_config_1.GOOGLE.CALLBACK_URL,
                    scope: ['profile', 'email']
                }, auth_service_1.AuthService.oAuth);
            case 'github':
                return new passport_github2_1.Strategy({
                    clientID: environment_config_1.GITHUB.ID,
                    clientSecret: environment_config_1.GITHUB.SECRET,
                    callbackURL: environment_config_1.GITHUB.CALLBACK_URL,
                    scope: ['profile', 'email']
                }, auth_service_1.AuthService.oAuth);
            case 'linkedin':
                return new passport_linkedin_oauth2_1.Strategy({
                    clientID: environment_config_1.LINKEDIN.ID,
                    clientSecret: environment_config_1.LINKEDIN.SECRET,
                    callbackURL: environment_config_1.LINKEDIN.CALLBACK_URL,
                    scope: ['profile', 'email']
                }, auth_service_1.AuthService.oAuth);
        }
    }
}
const instance = Authentication.get();
exports.Authentication = instance;
