import { MySQLError } from '@errors/mysql-error';
import { NotFoundError } from '@errors/not-found-error';
import { UploadError } from '@errors/upload-error';

export class ErrorFactory {
  constructor() {}
  static get(error: Error): Error {
    console.log('ERROR FIRED', error)
    switch (error.name) {
      case 'QueryFailedError':
        return new MySQLError(error);
      case 'UploadFailedError':
        return new UploadError(error);
      case 'EntityNotFound':
        return new NotFoundError(error);
      default:
        return error;
    }
  }
}