import * as Moment from 'moment-timezone';

import { Repository, EntityRepository, getRepository } from 'typeorm';
import { omitBy, isNil } from 'lodash';
import { uuidv4 } from 'uuid/v4';
import { badRequest, notFound, unauthorized } from 'boom';

import { User } from '@models/user.model';
import { IUserQueryString } from '@interfaces/IUserQueryString.interface';

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
    const options = omitBy({ id }, isNil);

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
      .leftJoinAndSelect('user.documents', 'd');

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
   * @param origin
   *
   */
  async findAndGenerateToken(options, origin?: string): Promise<{user: User, accessToken: string}> {

    const { email, password, refreshObject, apikey } = options;

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
  async oAuthLogin({ service, id, email, username, picture }): Promise<User> {

    const userRepository = getRepository(User);

    const user = await userRepository.findOne({
      where: { email },
    });

    if (user) {
      if (!user.username) user.username = username;
      return userRepository.save(user);
    }

    const password = uuidv4();

    return userRepository.create({ email, password, username });

  }
}
