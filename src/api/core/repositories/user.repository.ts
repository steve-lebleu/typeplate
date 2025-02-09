import * as Dayjs from 'dayjs';

import { omitBy, isNil } from 'lodash';
import { badRequest, notFound, unauthorized } from '@hapi/boom';

import { User } from '@models/user.model';
import { IRegistrable, ITokenOptions, IUserQueryString } from '@interfaces';
import { ApplicationDataSource } from '@config/database.config';

export const UserRepository = ApplicationDataSource.getRepository(User).extend({
  /**
   * @description Get one user
   *
   * @param id - The id of user
   *
   */
  one: async (id: number): Promise<User> => {

    const repository = ApplicationDataSource.getRepository(User);
    const options: { id: number } = omitBy({ id }, isNil) as { id: number };

    const user = await repository.findOne({
      where: options
    });

    if (!user) {
      throw notFound('User not found');
    }

    return user;
  },

  /**
   * @description Get a list of users according to current query parameters
   */
  list: async ({ page = 1, perPage = 30, username, email, role, status }: IUserQueryString): Promise<{result: User[], total: number}> => {

    const repository = ApplicationDataSource.getRepository(User);
    const options = omitBy({ username, email, role, status }, isNil) as IUserQueryString;

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

    if(options.status){
      query.andWhere('status = :status', { status });
    }

    const [ result, total ] = await query
      .skip( ( parseInt(page as string, 10) - 1 ) * parseInt(perPage as string, 10) )
      .take( parseInt(perPage as string, 10) )
      .getManyAndCount();

    return { result, total };
  },

  /**
   * @description Find user by email and try to generate a JWT token
   *
   * @param options Payload data
   */
  findAndGenerateToken: async (options: ITokenOptions): Promise<{user: User, accessToken: string}> => {

    const { email, password, refreshToken, apikey } = options;

    if (!email && !apikey) {
      throw badRequest('An email or an API key is required to generate a token')
    }

    const user = await ApplicationDataSource.getRepository(User).findOne({
      where : email ? { email } : { apikey }
    });

    if (!user) {
      throw notFound('User not found');
    } else if (password && await user.passwordMatches(password) === false) {
      throw unauthorized('Password must match to authorize a token generating');
    } else if (refreshToken && refreshToken.user.email === email && Dayjs(refreshToken.expires).isBefore( Dayjs() )) {
      throw unauthorized('Invalid refresh token');
    }

    return { user, accessToken: user.token() };
  },

  /**
   * @description Create / save user for oauth connexion
   *
   * @param options
   *
   * @fixme user should always retrieved from her email address. If not, possible collision on username value
   */
  oAuthLogin: async (options: IRegistrable): Promise<User> => {

    const { email, username, password } = options;

    const userRepository = ApplicationDataSource.getRepository(User);

    let user = await userRepository.findOne({
      where: [ { email }, { username } ],
    });

    if (user) {
      if (!user.username) {
        user.username = username;
        await userRepository.save(user)
      }
      if (user.email.includes('externalprovider') && !email.includes('externalprovider')) {
        user.email = email;
        await userRepository.save(user)
      }
      return user;
    }

    user = userRepository.create({ email, password, username });
    user = await userRepository.save(user);

    return user;
  }
});