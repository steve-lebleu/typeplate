import { Controller } from '@bases/controller.class';
import { unlink as _unlink } from 'fs';
import { expectationFailed } from 'boom';

/**
 * @description Endpoint decorator which catch errors fired while endpoint execution
 *
 * @param target Endpoint method reference
 * @param key Endpoint name
 */
const unlink = ( target: Controller, key: string ): any => {
  const method = target[key] as (req, res, next) => Promise<void> | void;
  target[key] = function (...args: any[]): void {
    const next = args[2] as (e?: Error) => void;
    const toUnlink = args[1].locals.data;
    console.log('toUnlinl', toUnlink);
    const result = method.apply(this, args) as Promise<void> | void;
    if (result && result instanceof Promise) {
      result
        .then(() => {
          console.log('New file', args[1].locals.data);
          
           // Déterminer où il faut effacer => master-copy, rescale/extra-large, rescale/extra-small, etc, sinon dans documents ou archives, et pourquoi pas vidéo ? 
           // img/video/audio/document/archive
           
          _unlink(toUnlink.path.toString(), (err) => {
            console.log('ERR', err);
            if(err) throw expectationFailed(err.message);
          });
          next();
        })
        .catch(e => next(e));
    }
  }
  return target[key] as (req, res, next) => void;
}

export { unlink }