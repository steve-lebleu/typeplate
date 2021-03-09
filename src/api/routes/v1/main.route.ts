import { Router } from '@bases/router.class';
import { MainController } from '@controllers/main.controller';

export class MainRouter extends Router {

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
    this.router.route('/status').get(MainController.status);

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
    this.router.route('/report-violation').post(MainController.report);

  }

}