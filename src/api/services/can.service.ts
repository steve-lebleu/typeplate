import { forbidden } from 'boom';
import { ROLE } from '@enums/role.enum';
import { User } from '@models/user.model';

/**
 * Manage entities access rights
 */
export class Can {

  constructor() {}

  /**
   * @description Check access right on entity
   *
   * @param user Current user
   * @param entity Current entity
   *
   * @throws {Error} 403 Forbidden
   */
  check(user: User, entity: any) {
    const checkOn = entity.hasOwnProperty('owner') ? entity.owner.id : entity.createdBy;
    if (user.role !== ROLE.admin && user.id !== checkOn) {
      throw forbidden('You can\'t access to this ressource');
    }
  }

  /**
   * @description Filter array of entities according to current user access rights
   *
   * @param user Current user
   * @param data Current entities collection
   */
  filter(user: User, data: any[]) {
    return [].concat(data).filter( (entry: any) => {
      const checkOn = entry.hasOwnProperty('owner') ? entry.owner.id : entry.createdBy;
      if ( user.role === ROLE.admin ) {
 return entry;
} else if (checkOn === user.id) {
 return entry;
}
    });
  }
}