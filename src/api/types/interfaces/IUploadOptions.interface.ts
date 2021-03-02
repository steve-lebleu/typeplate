import { UPLOAD_MIME_TYPE } from '@enums/mime-type.enum';

/**
 * Define allowed properties for upload options configuration
 */
export interface IUploadOptions {

  /**
   * @description Destination directory path
   */
  destination?: string;

  /**
   * @description Max filesize allowed for the current upload
   */
  filesize?: number;

  /**
   * @description Authorized mime-types
   */
  wildcards?: Array<UPLOAD_MIME_TYPE>;

  /**
   * @description Max concurrents files for the same upload process
   */
  maxFiles?: number;
}