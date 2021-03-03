import { Serializer } from '@bases/serializer.class';
import { whitelist as UserWhitelist } from '@whitelists/user.whitelist';
import { getRepository } from 'typeorm';
import { User } from '@models/user.model';

/**
 * Implements specific typed properties for Media json-api serializing / unserializing
 */
export class MediaSerializer extends Serializer {

  constructor() {
    super('documents', [
        'id',
        'fieldname',
        'filename',
        'path',
        'mimetype',
        'size',
        'owner',
        'createdAt'
      ],
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