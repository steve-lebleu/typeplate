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
  static check(user: User, entity: { owner?: { id?: number }, createdBy?: number }): void {
    const checkOn = entity.owner.id || entity.createdBy;
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
  static filter(user: User, data: { owner?: { id?: number }, createdBy?: number }[]): any[] {
    return [].concat(data).filter( (entity: { owner?: { id?: number }, createdBy?: number }) => {
      const checkOn = entity.owner.id || entity.createdBy;
      if ( user.role === ROLE.admin || checkOn === user.id ) {
        return entity;
      }
    });
  }
}