/**
 * @description Describe memory cache interface
 */
export interface ICache {
  put: (key: string, data: any, duration: number, cb?: () => void ) => void,
  del: (key: string) => boolean,
  clear: () => void,
  get: (key: string) => Record<string,unknown> | Record<string,unknown>[],
  size: () => number,
  memsize: () => number,
  debug: (active: boolean) => void,
  hits: () => number,
  misses: () => number,
  keys: () => string[],
  exportJson: () => string,
  importJson: (json: string, options: { skipDuplicate: boolean }) => number,
  Cache: () => void,
}