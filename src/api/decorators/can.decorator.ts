import { unauthorized, forbidden, notFound } from '@hapi/boom';
import { ROLES } from '@enums/role.enum';
import { User } from '@models/user.model';

/**
 * @description Endpoint decorator which allow ressource access
 *
 * @param property Property to use for access validation
 */
const can = ( property: 'id' | 'owner.id' | 'createdBy' ): any => {
  return ( target: Record<string, unknown>, key: string ) => {
    const method = target[key] as (req, res, next) => Promise<void> | void;
    target[key] = function (...args: any[]): void {
      const result = method.apply(this, args) as Promise<void> | void;
      if (result && result instanceof Promise) {
        const next = args[2] as (e?: Error) => void;
        result
          .then(() => {

            const { user } = args[0] as { user: User };
            const { locals } = args[1] as { locals?: { data: Record<string, unknown> | Record<string, unknown>[] } }

            if (Array.isArray(locals.data)) {
              locals.data.filter( ( entity: { id?: number, owner?: { id?: number }, createdBy?: number } ) => {
                const checkOn = entity.owner.id || entity.createdBy;
                if ( user?.role === ROLES.admin || checkOn === user.id ) {
                  return entity;
                }
              });
              return next();
            }

            if (!locals.data) {
              return next( notFound('Entity not found') );
            }

            const access = property
              .split('.')
              .reduce( (acc: Record<string, unknown>, current: string) => {
                return acc[current] || undefined;
              }, locals.data) as number;

            if (!access) {
              return next( unauthorized('You can\'t access to this ressource') );
            }

            if (user?.role !== ROLES.admin && user?.id !== access) {
              return next( forbidden('You can\'t access to this ressource') );
            }

            next();
          })
          .catch(e => next(e));
      }
    }
  }
}

export { can }