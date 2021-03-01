import { expectationFailed } from 'boom';
import { CREATED, NO_CONTENT } from 'http-status';
import { unlink } from 'fs';
import { getRepository, getCustomRepository } from 'typeorm';

import { IFileRequest } from '@interfaces/IFileRequest.interface';
import { IResponse } from '@interfaces/IResponse.interface';
import { Can } from '@services/can.service';
import { Document } from '@models/document.model';
import { DocumentRepository } from '@repositories/document.repository';
import { safe } from '@decorators/safe.decorator';

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
  static async get(req: IFileRequest, res: IResponse): Promise<void> {
    const documentRepository = getRepository(Document);
    const document = await documentRepository.findOneOrFail(req.params.documentId, { relations: ['owner'] });
    Can.check(req.user, document);
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
  static async update(req: IFileRequest, res: IResponse): Promise<void> {
    const documentRepository = getRepository(Document);
    const document = await documentRepository.findOne(req.params.documentId, { relations: ['owner'] });

    Can.check(req.user, document);

    if(req.file.filename !== document.filename) {
      unlink(document.path.toString(), (err) => {
        if(err) throw expectationFailed(err.message);
      });
    }

    documentRepository.merge(document, req.file);
    await documentRepository.save(document);

    res.locals.data = document;
  }

  /**
   * @description Delete one document according to :documentId
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   *
   * @public
   */
  @safe
  static async remove (req: IFileRequest, res: IResponse, next: (error?: Error) => void): Promise<void> {

    const documentRepository = getRepository(Document);
    const document = await documentRepository.findOneOrFail(req.params.documentId, { relations: ['owner'] });

    Can.check(req.user, document);

    unlink(document.path.toString(), (err) => {
      if(err) throw expectationFailed(err.message);
      documentRepository.remove(document);
      res.status(NO_CONTENT);
      next();
    });

  }
}

export { DocumentController };