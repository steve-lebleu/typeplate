import { Repository, EntityRepository, getRepository } from 'typeorm';
import { omitBy, isNil } from 'lodash';

import { Media } from '@models/media.model';
import { IMediaQueryString } from '@interfaces';
import { getMimeTypesOfType } from '@utils/string.util';

@EntityRepository(Media)
export class MediaRepository extends Repository<Media>  {

  /** */
  constructor() {
    super();
  }

  /**
   * @description Get a list of files according to current query
   */
  async list({ page = 1, perPage = 30, path, fieldname, filename, size, mimetype, owner, type }: IMediaQueryString): Promise<{result: Media[], total: number}> {

    const repository = getRepository(Media);

    const options = omitBy({ path, fieldname, filename, size, mimetype, owner, type }, isNil) as IMediaQueryString;

    const query = repository
      .createQueryBuilder('media')
      .leftJoinAndSelect('media.owner', 'u');

    if(options.fieldname) {
      query.andWhere('fieldname = :fieldname', { fieldname: options.fieldname })
    }

    if(options.filename) {
      query.andWhere('filename LIKE :filename', { filename: `%${options.filename}%` });
    }

    if(options.mimetype) {
      query.andWhere('mimetype LIKE :mimetype', { mimetype: `%${options.mimetype}%` });
    }

    if(options.type) {
      query.andWhere('mimetype IN (:mimetypes)', { mimetypes: getMimeTypesOfType(options.type) });
    }

    if(options.size) {
      query.andWhere('size >= :size', { size: `%${options.size}%` });
    }

    const [ result, total ] = await query
      .skip( ( page - 1 ) * perPage )
      .take( perPage )
      .getManyAndCount();

    return { result, total }
  }
}
