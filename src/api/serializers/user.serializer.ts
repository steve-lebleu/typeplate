import { Serializer } from '@bases/serializer.class';
import { whitelist as UserWhitelist } from '@whitelists/user.whitelist';
import { getRepository } from 'typeorm';

/**
 * Implements specific typed properties for User json-api serializing / unserializing
 */
export class UserSerializer extends Serializer {

  constructor() {
    super('users', UserWhitelist, {}, {})
  }

}