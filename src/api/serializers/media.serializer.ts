import { Serializer } from '@bases/serializer.class';
import { whitelist as UserWhitelist } from '@whitelists/user.whitelist';
import { whitelist as MediaWhitelist } from '@whitelists/media.whitelist';
import { getRepository } from 'typeorm';
import { User } from '@models/user.model';

/**
 * Implements specific typed properties for Media json-api serializing / unserializing
 */
export class MediaSerializer extends Serializer {

  constructor() {
    super('medias', MediaWhitelist,
    {
      user: {
        ref: 'id',
        attributes: UserWhitelist
      }
    },
    {
      user: {
        valueForRelationship: async (relationship: { id: number }) => {
          return await getRepository(User).findOne(relationship.id);
        }
      }
    })
  }

}