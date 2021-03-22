import { Repository, EntityRepository } from 'typeorm';
import { User } from '@models/user.model';
import { RefreshToken } from '@models/refresh-token.model';
import { RefreshTokenFactory } from '@factories/refresh-token.factory';

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> {

  constructor() {
    super();
  }

  /**
   * @description Generate a new refresh token
   *
   * @param user
   */
  generate(user: User): RefreshToken {
    const refreshToken = RefreshTokenFactory.get(user);
    void this.save(refreshToken);
    return refreshToken;
  }
}
