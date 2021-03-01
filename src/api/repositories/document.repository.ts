import { Document } from '@models/document.model';
import { IDocumentQueryString } from '@interfaces/IDocumentQueryString.interface';
import { Repository, EntityRepository, getRepository } from 'typeorm';
import { omitBy, isNil } from 'lodash';

@EntityRepository(Document)
export class DocumentRepository extends Repository<Document>  {

  /** */
  constructor() {
    super();
  }

  /**
   * @description Get a list of files according to current query parameters
   */
  async list({ page = 1, perPage = 30, path, fieldname, filename, size, mimetype, owner }: IDocumentQueryString): Promise<Document[]> {

    const repository = getRepository(Document);

    const options = omitBy({ path, fieldname, filename, size, mimetype, owner }, isNil) as IDocumentQueryString;

    const query = repository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.owner', 'u');

    if(options.fieldname) {
      query.andWhere('fieldname = :fieldname', { fieldname: options.fieldname })
    }

    if(options.filename) {
      query.andWhere('filename LIKE :filename', { filename: `%${options.filename}%` });
    }

    if(options.mimetype) {
      query.andWhere('mimetype LIKE :mimetype', { mimetype: `%${options.mimetype}%` });
    }

    if(options.size) {
      query.andWhere('size >= :size', { size: `%${options.size}%` });
    }

    const documents = await query
      .skip( ( page - 1 ) * perPage )
      .take( perPage )
      .getMany();

    return documents;
  }
}
