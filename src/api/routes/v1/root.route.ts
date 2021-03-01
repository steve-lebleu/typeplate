import { Router } from '@bases/router.class';
import { RootController } from '@controllers/root.controller';

export class RootRouter extends Router {

  constructor() {
    super()
  }

  /**
   * @description Plug routes definitions
   */
  define(): void {

    /**
     * @api {get} /status Ping API
     * @apiDescription Check API availability
     * @apiVersion 1.0.0
     * @apiName Status
     * @apiGroup Info
     * @apiPermission public
     *
     * @apiSuccess (Ok 200) {String} OK string success
     *
     * @apiError (Internal server error 500) Internal API is down
     */
    this.router.get('/status', RootController.status);

    /**
     * @ {post} /report-violation Log CSP
     *
     * @Description Log security policy violation.
     * @Version 1.0.0
     * @Name CSPViolationReport
     * @Group Info
     * @Permission public
     *
     * @Success (Success 200) Report successfully logged
     *
     * @Error (Internal server error 500) Internal server error while logging
     */
    this.router.post('/report-violation', RootController.report);

  }

}