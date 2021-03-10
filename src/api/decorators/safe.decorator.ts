import { Controller } from '@bases/controller.class';
import { remove } from '@services/media.service';

/**
 * @description Endpoint decorator which catch errors fired while endpoint execution
 *
 * @param target Endpoint method reference
 * @param key Endpoint name
 */
const safe = ( target: Controller, key: string ): any => {
  const method = target[key] as (req, res, next) => Promise<void> | void;
  target[key] = function (...args: any[]): void {
    const { files } = args[0] as { files: any[] };
    const next = args[2] as (e?: Error) => void;
    const result = method.apply(this, args) as Promise<void> | void;
    if (result && result instanceof Promise) {
      result
        .then(() => next())
        .catch(e => next(e));
    }
  }
  return target[key] as (req, res, next) => void;
}

export { safe }

/**
 * TODO fallback in catch
 * .catch(e => {
          console.log('Catched by decorator', e);
          if (files.length > 0) {
            console.log('Files foreach');
            files.forEach(file => remove(file));
          }
          return next(e); scope of next is not accessible
        });
 */