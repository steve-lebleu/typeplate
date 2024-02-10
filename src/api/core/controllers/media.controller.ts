import { clone } from 'lodash';

import { Database } from '@config/database.config';
import { IMedia, IMediaRequest, IResponse } from '@interfaces';
import { Safe } from '@decorators/safe.decorator';
import { MediaRepository } from '@repositories/media.repository';
import { Media } from '@models/media.model';

import { paginate } from '@utils/pagination.util';

/**
 * Manage incoming requests for api/{version}/medias
 */
class MediaController {

  /**
   * @description
   */
   private static instance: MediaController;

   private constructor() {}

    /**
     * @description
     */
  static get(): MediaController {
    if (!MediaController.instance) {
      MediaController.instance = new MediaController();
    }
    return MediaController.instance;
  }

  /**
   * @description Retrieve one document according to :documentId
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   *
   * @public
   */
  @Safe()
  async get(req: IMediaRequest, res: IResponse): Promise<void> {
    const repository = Database.dataSource.getRepository(Media);
    const media = await repository.findOneOrFail({ where: { id: req.params.mediaId }, relations: ['owner'] }) as Media;
    res.locals.data = media;
  }

  /**
   * @description Retrieve a list of documents, according to some parameters
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   */
  @Safe()
  async list (req: IMediaRequest, res: IResponse): Promise<void> {
    const response = await MediaRepository.list(req.query);
    res.locals.data = response.result;
    res.locals.meta = {
      total: response.total,
      pagination: paginate( parseInt(req.query.page, 10), parseInt(req.query.perPage, 10), response.total as number )
    }
  }

  /**
   * @description Create a new document
   *
   * @param req Express request object derived from http.incomingMessage
   * @param res Express response object
   *
   * @public
   */
  @Safe()
  async create(req: IMediaRequest, res: IResponse): Promise<void> {
    const repository = Database.dataSource.getRepository(Media);
    const medias = [].concat(req.files).map( (file) => new Media(file as IMedia));
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
  @Safe()
  async update(req: IMediaRequest, res: IResponse): Promise<void> {
    const repository = Database.dataSource.getRepository(Media);
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
  @Safe()
  async remove (req: IMediaRequest, res: IResponse): Promise<void> {
    const repository = Database.dataSource.getRepository(Media);
    const media = clone(res.locals.data) as Media;
    await repository.remove(media);
  }
}

const mediaController = MediaController.get();

export { mediaController as MediaController }