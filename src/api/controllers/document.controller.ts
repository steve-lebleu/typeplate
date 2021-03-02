import { expectationFailed } from 'boom';
import * as Moment from 'moment';
import { CREATED, NO_CONTENT } from 'http-status';

import { getRepository, getCustomRepository } from 'typeorm';

import { IFileRequest } from '@interfaces/IFileRequest.interface';
import { IResponse } from '@interfaces/IResponse.interface';
import { Can } from '@services/can.service';
import { Document } from '@models/document.model';
import { DocumentRepository } from '@repositories/document.repository';
import { safe } from '@decorators/safe.decorator';
import { can } from '@decorators/can.decorator';
import { unlink } from '@decorators/unlink.decorator';

/**
 * Manage incoming requests for api/{version}/documents
 */
class DocumentController {

  /** */
  constructor() {}

  /**
   * @description Retrieve one document according to :documentId
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   *
   * @public
   */
  @safe
  @can('owner.id')
  static async get(req: IFileRequest, res: IResponse): Promise<void> {
    const documentRepository = getRepository(Document);
    const document = await documentRepository.findOneOrFail(req.params.documentId, { relations: ['owner'] });
    res.locals.data = document;
  }

  /**
   * @description Retrieve a list of documents, according to some parameters
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @safe
  static async list (req: IFileRequest, res : IResponse): Promise<void> {
    const repository = getCustomRepository(DocumentRepository);
    const documents = await repository.list(req.query);
    res.locals.data = Can.filter(req.user, documents);
  }

  /**
   * @description Create a new document
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   *
   * @public
   */
  @safe
  static async create(req: IFileRequest, res: IResponse): Promise<void> {
    const documentRepository = getRepository(Document);
    const documents = [].concat(req.files).map( (file) => {
      return new Document(file);
    });
    await documentRepository.save(documents);
    res.status( CREATED );
    res.locals.data = documents;
  }

  /**
   * @description Update one document according to :documentId
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   *
   * @public
   */
  @safe
  @unlink
  static async update(req: IFileRequest, res: IResponse): Promise<void> {
    const documentToUpdate = res.locals.data as Document;
    const documentRepository = getRepository(Document);

    documentToUpdate.updatedAt = Moment( new Date() ).format('YYYY-MM-DD HH:ss') as Date;

    documentRepository.merge(documentToUpdate, req.file);
    await documentRepository.save(documentToUpdate);

    res.locals.data = documentToUpdate;
  }

  /**
   * @description Delete one document according to :documentId
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   *
   * @public
   */
  @safe
  @unlink
  static async remove (req: IFileRequest, res: IResponse): Promise<void> {

    const documentToDelete = res.locals.data as Document;
    const documentRepository = getRepository(Document);

    await documentRepository.remove(documentToDelete);

    res.status(NO_CONTENT);

  }
}

export { DocumentController };