import { authenticate } from 'passport';
import { promisify } from 'es6-promisify';
import { forbidden, badRequest } from 'boom';

import { User } from '@models/user.model';
import { ROLE } from '@enums/role.enum';
import { list } from '@utils/enum.util';

const ADMIN = ROLE.admin;
const LOGGED_USER = ROLE.user;
const GHOST = ROLE.ghost;

export { ADMIN, LOGGED_USER, GHOST };

/**
 * Authentication middleware
 *
 * @dependency passport
 * @see http://www.passportjs.org/
 */
export class Guard {

  constructor() {}

  /**
   * @description Callback function provided to passport.authenticate when authentication strategy is JWT
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   * @param roles Authorized roles
   */
  private static handleJWT = (req, res, next: Function, roles) => async (err: Error, user: User, info) => {

    const error = err || info;

    const logIn = promisify(req.logIn);

    try {
      if (error || !user) throw error;
      await logIn(user, { session: false });
    } catch (e) {
 return next( forbidden(e) );
}

    if (roles === LOGGED_USER && user.role !== 'admin' && req.params.userId !== user.id.toString() ) {
      return next( forbidden('Forbidden area') );
    } else if (!roles.includes(user.role)) {
      return next( forbidden('Forbidden area') );
    } else if (err || !user) {
      return next( badRequest(err) );
    }

    // req.user = user.whitelist(); // TODO: deprecated ?
    req.user = user;

    return next();
  }

  /**
   * @description Authorize user access according to role(s) in arguments
   *
   * @param roles
   */
  static authorize = (roles = list(ROLE)) => (req, res, next) => authenticate( 'jwt', { session: false }, Guard.handleJWT(req, res, next, roles) ) (req, res, next);

  /**
   * @description Authorize user access according to service.access_token
   * @param service Service to use for authentication
   */
  static oauth = service => authenticate(service, { session: false });
}