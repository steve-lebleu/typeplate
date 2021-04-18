import { Request } from 'express';

import { CONTENT_TYPE } from '@config/environment.config';
import { CONTENT_TYPE as CONTENT_TYPE_ENUM } from '@enums';
import { IResponse } from '@interfaces';

import { SanitizeService } from '@services/sanitizer.service';

/**
 * @description
 */
 class Sanitize {

  /**
   * @description
   */
  private static instance: Sanitize;

  private constructor() {}

  /**
   * @description
   */
  static get(): Sanitize {
    if (!Sanitize.instance) {
      Sanitize.instance = new Sanitize();
    }
    return Sanitize.instance;
  }

  /**
   * @description Clean current data before output if the context requires it
   *
   * @param req Express Request instance
   * @param res Express Response instance
   * @param next Callback function
   */
   async sanitize(req: Request, res: IResponse, next: () => void): Promise<void> {

    const hasContent = typeof res.locals.data !== 'undefined';

    if (req.method === 'DELETE' || CONTENT_TYPE !== CONTENT_TYPE_ENUM['application/json'] || !hasContent) {
      return next();
    }

    if ( res.locals.data === null || !SanitizeService.hasEligibleMember(res.locals.data) ) {
      return next();
    }

    res.locals.data = SanitizeService.process(res.locals.data);

    next();
  }
}

const sanitize = Sanitize.get();

export { sanitize as Sanitize };