import * as Moment from 'moment-timezone';

import { Repository, EntityRepository, getRepository } from 'typeorm';
import { omitBy, isNil } from 'lodash';
import { badRequest, notFound, unauthorized } from '@hapi/boom';

import { User } from '@models/user.model';
import { IUserQueryString } from '@interfaces/IUserQueryString.interface';
import { IOauth } from '@interfaces/IOauth.interface';
import { ITokenOptions } from '@interfaces/ITokenOptions.interface';
import { hash } from '@utils/string.util';

@EntityRepository(User)
export class UserRepository extends Repository<User>  {

  constructor() {
    super();
  }

  /**
   * @description Get one user
   *
   * @param id - The id of user
   *
   */
  async one(id: number): Promise<User> {

    const repository = getRepository(User);
    const options: { id: number } = omitBy({ id }, isNil) as { id: number };

    const user = await repository.findOne({
      where: options
    });

    if (!user) {
      throw notFound('User not found');
    }

    return user;
  }

  /**
   * @description Get a list of users according to current query parameters
   */
  async list({ page = 1, perPage = 30, username, email, role, transporter, smtp }: IUserQueryString): Promise<User[]> {

    const repository = getRepository(User);
    const options = omitBy({ username, email, role, transporter, smtp }, isNil) as IUserQueryString;

    const query = repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.medias', 'd');

    if(options.username) {
      query.andWhere('user.username = :username', { username });
    }

    if(options.email) {
      query.andWhere('email = :email', { email });
    }

    if(options.role){
      query.andWhere('role = :role', { role });
    }

    const users = await query
      .skip( ( page - 1 ) * perPage )
      .take( perPage )
      .getMany();

    return users;
  }

  /**
   * @description Find user by email and try to generate a JWT token
   *
   * @param options Payload data
   */
  async findAndGenerateToken(options: ITokenOptions): Promise<{user: User, accessToken: string}> {

    const { email, password, refreshToken, apikey } = options;

    if (!email && !apikey) {
      throw badRequest('An email or an API key is required to generate a token')
    }

    const user = await this.findOne({
      where : email ? { email } : { apikey }
    });

    if (!user) {
      throw notFound('User not found');
    } else if (password && await user.passwordMatches(password) === false) {
      throw unauthorized('Password must match to authorize a token generating');
    } else if (refreshToken && refreshToken.user.email === email && Moment(refreshToken.expires).isBefore()) {
      throw unauthorized('Invalid refresh token');
    }

    return { user, accessToken: user.token() };
  }

  /**
   * @description Create / save user for oauth connexion
   *
   * @param options
   */
  async oAuthLogin(options: IOauth): Promise<User> {

    const { email, username } = options;

    const userRepository = getRepository(User);

    let user = await userRepository.findOne({
      where: { email },
    });

    if (user) {
      if (!user.username) {
        user.username = username;
      }
      return userRepository.save(user);
    }

    user = userRepository.create({ email, password: hash('email', 16), username });

    return userRepository.save(user);
  }
}
