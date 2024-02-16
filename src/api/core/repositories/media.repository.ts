import { omitBy, isNil } from 'lodash';

import { Media } from '@models/media.model';
import { IMediaQueryString } from '@interfaces';
import { getMimeTypesOfType } from '@utils/string.util';
import { ApplicationDataSource } from '@config/database.config';

export const MediaRepository = ApplicationDataSource.getRepository(Media).extend({

  list: async ({ page = 1, perPage = 30, path, fieldname, filename, size, mimetype, owner, type }: IMediaQueryString): Promise<{result: Media[], total: number}> => {
    const repository = ApplicationDataSource.getRepository(Media);

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
      .skip( ( parseInt(page as string, 10) - 1 ) * parseInt(perPage as string, 10) )
      .take( parseInt(perPage as string, 10) )
      .getManyAndCount();

    return { result, total }
  }
});