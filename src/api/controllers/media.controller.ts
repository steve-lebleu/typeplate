
import * as Moment from 'moment';
import { CREATED, NO_CONTENT } from 'http-status';

import { getRepository, getCustomRepository } from 'typeorm';

import { IFileRequest } from '@interfaces/IFileRequest.interface';
import { IResponse } from '@interfaces/IResponse.interface';
import { Can } from '@services/can.service';
import { Media } from '@models/media.model';
import { MediaRepository } from '@repositories/media.repository';
import { safe } from '@decorators/safe.decorator';
import { can } from '@decorators/can.decorator';
import { unlink } from '@decorators/unlink.decorator';

/**
 * Manage incoming requests for api/{version}/medias
 */
class MediaController {

  /** */
  constructor() {}

  /**
   * @description Retrieve one media according to :mediaId
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   *
   * @public
   */
  @safe
  @can('owner.id')
  static async get(req: IFileRequest, res: IResponse): Promise<void> {
    const repository = getRepository(Media);
    const media = await repository.findOneOrFail(req.params.mediaId, { relations: ['owner'] });
    res.locals.data = media;
  }

  /**
   * @description Retrieve a list of medias, according to query string parameters
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @safe
  static async list (req: IFileRequest, res : IResponse): Promise<void> {
    const repository = getCustomRepository(MediaRepository);
    const medias = await repository.list(req.query);
    res.locals.data = Can.filter(req.user, medias);
  }

  /**
   * @description Create a new media
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   *
   * @public
   */
  @safe
  static async create(req: IFileRequest, res: IResponse): Promise<void> {
    const repository = getRepository(Media);
    const medias = [].concat(req.files).map( (file) => {
      return new Media(file);
    });
    await repository.save(medias);
    res.status( CREATED );
    res.locals.data = medias;
  }

  /**
   * @description Update one media according to :mediaId
   *
   * @route /api/vn/medias/:mediaId
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   *
   * @public
   */
  @safe
  @unlink
  static async update(req: IFileRequest, res: IResponse): Promise<void> {
    const mediaToUpdate = res.locals.data as Media;
    const repository = getRepository(Media);

    mediaToUpdate.updatedAt = Moment( new Date() ).format('YYYY-MM-DD HH:ss') as Date;

    repository.merge(mediaToUpdate, req.file);
    await repository.save(mediaToUpdate);

    res.locals.data = mediaToUpdate;
  }

  /**
   * @description Delete one media according to :mediaId
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   *
   * @public
   */
  @safe
  @unlink
  static async remove (req: IFileRequest, res: IResponse): Promise<void> {

    const mediaToDelete = res.locals.data as Media;
    const repository = getRepository(Media);

    await repository.remove(mediaToDelete);

    res.status(NO_CONTENT);

  }
}

export { MediaController };