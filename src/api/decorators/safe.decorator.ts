import { Controller } from '@bases/controller.class';

/**
 * @description Endpoint decorator which catch errors fired while endpoint execution
 *
 * @param target Endpoint method reference
 * @param key Endpoint name
 */
const safe = ( target: Controller, key: string ): any => {
  const method = target[key] as (req, res, next) => Promise<void> | void;
  target[key] = function (...args: any[]): void {
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