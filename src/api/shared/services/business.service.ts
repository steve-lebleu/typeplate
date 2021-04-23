import { BusinessError } from '@errors';
import { HttpMethod } from '@types';

import { User } from '@models/user.model';
import { Media } from '@models/media.model';

import { IUserRequest } from '@interfaces/user-request.interface';
import { IMediaRequest } from '@interfaces/media-request.interface';

import { BusinessRule } from '@shared/types/business-rule.type';

/**
 * @class BusinessService
 *
 * @summary Mother class of business services
 */
export abstract class BusinessService {

  readonly BUSINESS_RULES: BusinessRule[];

  constructor() {}

  /**
   * @description Valid a set of business rules
   *
   * @param entity
   * @param req
   *
   * @throws BusinessError
   */
  valid(entity: User|Media, req: IUserRequest|IMediaRequest): boolean {
    return this.BUSINESS_RULES
      .filter(rule => rule.methods.includes(req.method as HttpMethod))
      .reduce((acc, current) => {
        if (!current.check(req.user, entity, req)) {
          throw new BusinessError( { name: 'BusinessError', statusCode: current.statusCode, message: current.description } );
        }
        return acc && true;
      }, true);
  }
}