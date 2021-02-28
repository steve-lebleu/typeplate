import { expectationFailed } from 'boom';
import { CREATED, NO_CONTENT } from 'http-status';
import { unlink } from 'fs';

import { Request, Response } from 'express';
import { Container } from '@config/container.config';

import { Document } from '@models/document.model';

import { getRepository, getCustomRepository } from 'typeorm';
import { DocumentRepository } from '@repositories/document.repository';
import { Controller } from '@bases/controller.class';

import { checkMySQLError } from '@utils/error.util';

/**
 * Manage incoming requests for api/{version}/documents
 */
class DocumentController extends Controller {

  /** */
  constructor() {
 super();
}

  /**
   * @description Retrieve one document according to :documentId
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   *
   * @public
   */
  async get(req: Request, res: Response, next: Function) {
    try {
      const documentRepository = getRepository(Document);
      const document = await documentRepository.findOneOrFail(req.params.documentId, { relations: ['owner'] });
      Container.resolve('Can').check(req.user, document);
      res.locals.data = document;
      next();
    } catch(e) {
      next( checkMySQLError( e ) );
    }
  }

  /**
   * @description Retrieve a list of documents, according to some parameters
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  async list (req: Request, res : Response, next: Function) {
    try {
      const repository = getCustomRepository(DocumentRepository);
      const documents = await repository.list(req.query);
      res.locals.data = Container.resolve('Can').filter(req.user, documents);
      next();
    } catch (e) {
      next( checkMySQLError( e ) );
    }
  }

  /**
   * @description Create a new document
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   *
   * @public
   */
  async create(req: Request, res: Response, next: Function) {
    try {
      const documentRepository = getRepository(Document);
      const documents = [].concat(req.files).map( (file) => {
        return new Document(file);
      });
      await documentRepository.save(documents);
      res.status( CREATED );
      res.locals.data = documents;
      next();
    } catch(e) {
      next( checkMySQLError( e ) );
    }
  }

  /**
   * @description Update one document according to :documentId
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   *
   * @public
   */
  async update(req: Request, res: Response, next: Function) {
    try {

      const documentRepository = getRepository(Document);
      const document = await documentRepository.findOne(req.params.documentId, { relations: ['owner'] });

      Container.resolve('Can').check(req.user, document);

      if(req.file.filename !== document.filename) {
        unlink(document.path.toString(), (err) => {
          if(err) throw expectationFailed(err.message);
        });
      }

      documentRepository.merge(document, req.file);
      documentRepository.save(document);

      res.locals.data = document;
      next();
    } catch(e) {
      next( checkMySQLError( e ) );
    }
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
  async remove (req: Request, res : Response, next: Function) {

    try {

      const documentRepository = getRepository(Document);
      const document = await documentRepository.findOneOrFail(req.params.documentId, { relations: ['owner'] });

      Container.resolve('Can').check(req.user, document);

      unlink(document.path.toString(), (err) => {
        if(err) throw expectationFailed(err.message);
        documentRepository.remove(document);
        res.status(NO_CONTENT);
        next();
      });

    } catch(e) {
      next( checkMySQLError( e ) );
    }

  }
}

export { DocumentController };