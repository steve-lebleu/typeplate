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
  wildcards?: string[];

  /**
   * @description Max concurrents files for the same upload process
   */
  maxFiles?: number;
}