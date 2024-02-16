import { User } from '@models/user.model';
import { RefreshToken } from '@models/refresh-token.model';
import { RefreshTokenFactory } from '@factories/refresh-token.factory';
import { ApplicationDataSource } from '@config/database.config';

export const RefreshTokenRepository = ApplicationDataSource.getRepository(RefreshToken).extend({
  /**
   * @description Generate a new refresh token
   *
   * @param user
   */
  generate: (user: User): RefreshToken => {
    const refreshToken = RefreshTokenFactory.get(user);
    void ApplicationDataSource.getRepository(RefreshToken).save(refreshToken);
    return refreshToken;
  }
});