import { IError } from "@interfaces/IError.interface";
import { IFieldError } from "@interfaces/IFieldError.interface";

/**
 * Type upload error
 */
export class UploadError implements IError {

  /**
   * @description HTTP response status code
   */
  statusCode: number;

  /**
   * @description HTTP response status message
   */
  statusText: string;

  /**
   * @description HTTP response errors
   */
  errors: Array<IFieldError|string>;

  /**
   * @param {number} status 
   * @param {message} message 
   * @param {Array<IFieldError|string>} errors 
   */
  constructor(error: Error) { 
    this.statusCode = 400;
    this.statusText = error.name;
    this.errors = [error.message];
  }

}