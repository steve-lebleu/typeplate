import { HttpMethod } from '@types';

import { User } from '@models/user.model';
import { Media } from '@models/media.model';

import { IUserRequest } from '@interfaces/user-request.interface';
import { IMediaRequest } from '@interfaces/media-request.interface';

/**
 * @description Generic structure of a business rule
 */
export type BusinessRule = {
  key: string,
  description: string,
  statusCode: number,
  methods: HttpMethod[],
  check(user: User, entity: User|Media, payload: IUserRequest|IMediaRequest): boolean
};
