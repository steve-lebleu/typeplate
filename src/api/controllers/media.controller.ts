import { getRepository, getCustomRepository } from 'typeorm';
import { clone } from 'lodash';

import { IMediaRequest } from '@interfaces/IMediaRequest.interface';
import { IResponse } from '@interfaces/IResponse.interface';

import { safe } from '@decorators/safe.decorator';

import { MediaRepository } from '@repositories/media.repository';
import { Media } from '@models/media.model';

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
   *
   * @public
   */
  @safe
  static async get(req: IMediaRequest, res: IResponse): Promise<void> {
    const repository = getRepository(Media);
    const media = await repository.findOneOrFail(req.params.mediaId, { relations: ['owner'] });
    res.locals.data = media;
  }

  /**
   * @description Retrieve a list of documents, according to some parameters
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
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
   *
   * @public
   *
   * FIXME: Fallback on upload -> delete file when data is not saved
   */
  @safe
  static async create(req: IMediaRequest, res: IResponse): Promise<void> {
    const repository = getRepository(Media);
    const medias = [].concat(req.files).map( (file) => new Media(file));
    await repository.save(medias);
    res.locals.data = medias;
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
  static async update(req: IMediaRequest, res: IResponse): Promise<void> {
    const repository = getRepository(Media);
    const media = clone(res.locals.data) as Media;
    repository.merge(media, req.files[0] as unknown);
    await repository.save(media);
    res.locals.data = media;
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
  static async remove (req: IMediaRequest, res: IResponse): Promise<void> {
    const repository = getRepository(Media);
    const media = clone(res.locals.data) as Media;
    await repository.remove(media);
  }
}

export { MediaController };