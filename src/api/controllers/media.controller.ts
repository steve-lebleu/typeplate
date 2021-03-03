import { expectationFailed } from 'boom';
import { CREATED, NO_CONTENT } from 'http-status';
import { unlink } from 'fs';

import { IMediaRequest } from '@interfaces/IMediaRequest.interface';

import { getRepository, getCustomRepository } from 'typeorm';


import { EventEmitter } from 'events';
import { promisify } from 'es6-promisify';

import { safe } from '@decorators/safe.decorator';
import { IResponse } from '@interfaces/IResponse.interface';
import { MediaRepository } from '@repositories/media.repository';
import { Media } from '@models/media.model';

const emitter = new EventEmitter();

emitter.on('media.synchronized', (media: Media) => {
  console.log('unling');
  /*
   unlink(document.path.toString(), (err) => {
        if(err) throw expectationFailed(err.message);
        documentRepository.remove(document);
        res.status(NO_CONTENT);
        next();
      });*/
});

/**
 * Manage incoming requests for api/{version}/medias
 */
class MediaController {

  /** */
  constructor() { }

  /**
   * @description Retrieve one document according to :documentId
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   *
   * @public
   */
  @safe
  static async get(req: IMediaRequest, res: IResponse): Promise<void> {
    const repository = getRepository(Media);
    const media = await repository.findOne(req.params.mediaId, { relations: ['owner'] });
    res.locals.data = media;
  }

  /**
   * @description Retrieve a list of documents, according to some parameters
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   * @param next Callback function
   */
  @safe
  static async list (req: IMediaRequest, res: IResponse): Promise<void> {
    const repository = getCustomRepository(MediaRepository);
    const medias = await repository.list(req.query);
    res.locals.data = medias;
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
  @safe
  static async create(req: IMediaRequest, res: IResponse): Promise<void> {
    const repository = getRepository(Document);
    const medias = [].concat(req.files).map( (file) => {
      return new Media(file);
    });
    await repository.save(medias);
    res.status( CREATED );
    res.locals.data = medias;
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
  @safe
  static async update(req: IMediaRequest, res: IResponse): Promise<void> {
    const repository = getRepository(Media);
    const media = res.locals.data as Media;
    repository.merge(media, req.file);
    await repository.save(media);
    emitter.emit('media.synchronized', res.locals.data as Media);
    res.locals.data = media;
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
  static async remove (req: IMediaRequest, res: IResponse): Promise<void> {
    const repository = getRepository(Media);
    const media = res.locals.data as Media;
    await repository.remove(media);
    emitter.emit('media.synchronized', res.locals.data as Media);
    res.status(NO_CONTENT);
  }
}

export { MediaController };