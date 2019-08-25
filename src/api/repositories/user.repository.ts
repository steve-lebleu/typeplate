import * as Moment from "moment-timezone";

import { Repository, EntityRepository, getRepository } from "typeorm";
import { omitBy, isNil } from "lodash";
import { uuidv4 } from "uuid/v4";
import { badRequest, notFound, unauthorized } from "boom";

import { User } from "@models/user.model";

@EntityRepository(User)
export class UserRepository extends Repository<User>  {

  constructor() { super(); }

  /**
   * @description Get one user
   * 
   * @param {number} id - The id of user
   * 
   */
  async one(id: number) {

    const repository = await getRepository(User);
    const options = omitBy({ id }, isNil);

    const user = await repository.findOne({
      where: options
    });

    if (!user) {
      throw notFound('User not found');
    }
    
    return new User(user);
  }

  /**
   * @description Get a list of users according to current query parameters
   */
  async list({ page = 1, perPage = 30, username, email, role, transporter, smtp }) {
    
    const repository = getRepository(User);
    const options = omitBy({ username, email, role, transporter, smtp }, isNil);

    let users;

    let query = repository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.documents", "d");

    if(options.username) {
      query.andWhere("user.username = :username", { username });
    }

    if(options.email) {
      query.andWhere("email = :email", { email });
    }

    if(options.role){
      query.andWhere("role = :role", { role });
    }

    users = await query
      .skip( ( page - 1 ) * perPage )
      .take( perPage )
      .getMany();
    
    return users;
  }

  /**
   * @description Find user by email and try to generate a JWT token
   *
   * @param {any} options Payload data
   * @param {string} origin
   * 
   */
  async findAndGenerateToken(options, origin?: string) {

    const { email, password, refreshObject, apikey } = options;

    if (!email && !apikey) { 
      throw badRequest('An email or an API key is required to generate a token') 
    };

    const user = await this.findOne({ 
      where : email ? { email } : { apikey } 
    });

    if (!user) {
      throw notFound('User not found');
    } else if (password && await user.passwordMatches(password) === false) {
      throw unauthorized('Password must match to authorize a token generating');
    } else if (refreshObject && refreshObject.user.email === email && Moment(refreshObject.expires).isBefore()) {
      throw unauthorized('Invalid refresh token');
    } 

    return { user, accessToken: user.token() };
  }

  /**
   * TODO: rename
   * TODO: don't create user if not exists
   * TODO: deprecated ?
   */
  async oAuthLogin({ service, id, email, username, picture }) {

    const userRepository = getRepository(User);

    const user = await userRepository.findOne({
      where: { email : email },
    });

    if (user) {
      if (!user.username) user.username = username;
      return userRepository.save(user);
    }

    const password = uuidv4();

    return userRepository.create({ email, password, username });

  }
}
