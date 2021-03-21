import { Controller } from '@classes';
import { MediaService } from '@services/media.service';

/**
 * @decorator Safe
 *
 * @description Endpoint decorator which catch errors fired while endpoint execution
 *
 * @param target Endpoint method reference
 * @param key Endpoint name
 */
const Safe = (): any => {
  return ( target: Controller, key: string ): any => {
    const method = target[key] as (req, res, next) => Promise<void> | void;
    target[key] = function (...args: any[]): void {
      const { files } = args[0] as { files: any[] };
      const next = args[2] as (e?: Error) => void;
      const result = method.apply(this, args) as Promise<void> | void;
      if (result && result instanceof Promise) {
        result
          .then(() => next())
          .catch(e => {
            if (files && files.length > 0) {
              files.map(f => MediaService.remove(f))
            }
            next(e);
          });
      }
    }
    return target[key] as (req, res, next) => void;
  }
}

export { Safe }