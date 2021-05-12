/**
 * @description
 *
 * @param val
 */
const isObject = (val: unknown): boolean => typeof val === 'object' && val !== null;

export { isObject }