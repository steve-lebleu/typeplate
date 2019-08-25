import * as Moment from "moment-timezone";

import { Repository, EntityRepository } from "typeorm";
import { randomBytes } from "crypto";
import { expectationFailed } from "boom";
import { User } from "@models/user.model";
import { RefreshToken } from "@models/refresh-token.model";

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> {

  constructor() { super(); }

  /**
   * @description Generate a new refresh token
   * 
   * @param {User} user 
   */
  generate(user: User): RefreshToken {
    try {
      const token = `${user.id}.${randomBytes(40).toString('hex')}`;
      const expires = Moment().add(30, 'days').toDate();
      const refreshToken = new RefreshToken( token, user, expires );
      this.save(refreshToken);
      return refreshToken;
    }
    catch(e) { throw expectationFailed(e.message); }  
  }
}
