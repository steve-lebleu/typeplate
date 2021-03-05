import { CREATED, NO_CONTENT } from 'http-status';
import { getRepository, getCustomRepository } from 'typeorm';
import { clone } from 'lodash';

import { IMediaRequest } from '@interfaces/IMediaRequest.interface';
import { IResponse } from '@interfaces/IResponse.interface';

import { safe } from '@decorators/safe.decorator';
import { can } from '@decorators/can.decorator';

import { MediaRepository } from '@repositories/media.repository';
import { Media } from '@models/media.model';

import { MEDIA_EVENT_EMITTER } from '@events/media.event';

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
  @can('owner.id')
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
  @can('owner.id')
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
    console.log('--- CREATE')
    const repository = getRepository(Media);
    console.log('--- REPOSITORY')
    const medias = [].concat(req.files).map( (file) => new Media(file));
    console.log('--- MEDIAS')
    await repository.save(medias);
    console.log('--- SAVED')
    res.status( CREATED );
    console.log('--- STATUS SET')
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
    const media = clone(res.locals.data) as Media;
    repository.merge(media, req.files[0] as unknown);
    await repository.save(media);
    MEDIA_EVENT_EMITTER.emit('media.synchronized', res.locals.data as Media);
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
  @can('owner.id')
  static async remove (req: IMediaRequest, res: IResponse): Promise<void> {
    const repository = getRepository(Media);
    const media = clone(res.locals.data) as Media;
    await repository.remove(media);
    MEDIA_EVENT_EMITTER.emit('media.synchronized', res.locals.data as Media);
    res.status(NO_CONTENT);
  }
}

export { MediaController };