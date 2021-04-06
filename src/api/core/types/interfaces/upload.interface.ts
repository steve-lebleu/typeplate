import { IStorage } from '@interfaces';

/**
 * @description
 */
export interface IUpload {
  diskStorage: ( { destination, filename } ) => IStorage;
  // eslint-disable-next-line id-blacklist
  any: () => ( req, res, next ) => void;
}
