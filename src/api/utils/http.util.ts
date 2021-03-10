import { CREATED, OK, NO_CONTENT, NOT_FOUND } from 'http-status';

/**
 * @description Get the HTTP status code to output for current request
 *
 * @param method
 * @param hasContent
 */
const getStatusCode = (method: string, hasContent: boolean): number => {
  switch (method) {
    case 'GET':
      return OK;
    case 'POST':
      return hasContent ? CREATED : NO_CONTENT;
    case 'PUT':
    case 'PATCH':
      return hasContent ? OK : NO_CONTENT;
    case 'DELETE':
      return NO_CONTENT
  }
}

export { getStatusCode }