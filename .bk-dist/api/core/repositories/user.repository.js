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
exports.UserRepository = void 0;
const Moment = require("moment-timezone");
const typeorm_1 = require("typeorm");
const lodash_1 = require("lodash");
const boom_1 = require("@hapi/boom");
const user_model_1 = require("@models/user.model");
let UserRepository = class UserRepository extends typeorm_1.Repository {
    constructor() {
        super();
    }
    /**
     * @description Get one user
     *
     * @param id - The id of user
     *
     */
    async one(id) {
        const repository = typeorm_1.getRepository(user_model_1.User);
        const options = lodash_1.omitBy({ id }, lodash_1.isNil);
        const user = await repository.findOne({
            where: options
        });
        if (!user) {
            throw boom_1.notFound('User not found');
        }
        return user;
    }
    /**
     * @description Get a list of users according to current query parameters
     */
    async list({ page = 1, perPage = 30, username, email, role, transporter, smtp }) {
        const repository = typeorm_1.getRepository(user_model_1.User);
        const options = lodash_1.omitBy({ username, email, role, transporter, smtp }, lodash_1.isNil);
        const query = repository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.medias', 'd');
        if (options.username) {
            query.andWhere('user.username = :username', { username });
        }
        if (options.email) {
            query.andWhere('email = :email', { email });
        }
        if (options.role) {
            query.andWhere('role = :role', { role });
        }
        const users = await query
            .skip((page - 1) * perPage)
            .take(perPage)
            .getMany();
        return users;
    }
    /**
     * @description Find user by email and try to generate a JWT token
     *
     * @param options Payload data
     */
    async findAndGenerateToken(options) {
        const { email, password, refreshToken, apikey } = options;
        if (!email && !apikey) {
            throw boom_1.badRequest('An email or an API key is required to generate a token');
        }
        const user = await this.findOne({
            where: email ? { email } : { apikey }
        });
        if (!user) {
            throw boom_1.notFound('User not found');
        }
        else if (password && await user.passwordMatches(password) === false) {
            throw boom_1.unauthorized('Password must match to authorize a token generating');
        }
        else if (refreshToken && refreshToken.user.email === email && Moment(refreshToken.expires).isBefore()) {
            throw boom_1.unauthorized('Invalid refresh token');
        }
        return { user, accessToken: user.token() };
    }
    /**
     * @description Create / save user for oauth connexion
     *
     * @param options
     *
     * FIXME: user should always retrieved from her email address. If not, possible collision on username value
     */
    async oAuthLogin(options) {
        const { email, username, password } = options;
        const userRepository = typeorm_1.getRepository(user_model_1.User);
        let user = await userRepository.findOne({
            where: [{ email }, { username }],
        });
        if (user) {
            if (!user.username) {
                user.username = username;
                await userRepository.save(user);
            }
            if (user.email.includes('externalprovider') && !email.includes('externalprovider')) {
                user.email = email;
                await userRepository.save(user);
            }
            return user;
        }
        user = userRepository.create({ email, password, username });
        return userRepository.save(user);
    }
};
UserRepository = __decorate([
    typeorm_1.EntityRepository(user_model_1.User),
    __metadata("design:paramtypes", [])
], UserRepository);
exports.UserRepository = UserRepository;
