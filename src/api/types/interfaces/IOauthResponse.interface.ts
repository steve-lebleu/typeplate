import { OAuthProvider } from '@types';

export interface IOauthResponse {

  /**
   *
   */
  id: number;

  /**
   *
   */
  displayName: string,

  /**
   *
   */
  name?: { familyName: string, givenName: string },

  /**
   *
   */
  emails: { value: string, verified?: boolean }[],

  /**
   *
   */
  photos: { value: string }[],

  /**
   *
   */
  provider: { name: OAuthProvider, _raw: string, _json: Record<string,unknown> }

  /**
   *
   */
  username?: string;
}