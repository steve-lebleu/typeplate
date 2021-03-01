import { default as Axios } from 'axios';

import { IAuthExternalProvider } from '@interfaces/IAuthExternalProvider.interface';

/**
 * Manage some authentication related actions:
 *
 * - Do effective authentication by oauth
 * - Provide provider keys, not whitelisted by default
 * - Provide smtp credentials, not whitelisted by default
 */
export class AuthProvider {

  constructor() {}

  /**
   * @description Try to connect to Facebook
   *
   * @param access_token Token registered on user // TODO:
   */
  static facebook = async (access_token: string): Promise<IAuthExternalProvider> => {
    const fields = 'id, name, email, picture';
    const url = 'https://graph.facebook.com/me';
    const params = { access_token, fields };
    const response = await Axios.get(url, { params });
    const { id, name, email, picture } = response.data as { id: number, name: string, email: string, picture: { data: { url: string } } };
    return {
      service: 'facebook',
      picture: picture.data.url,
      id,
      name,
      email
    };
  }

  /**
   * @description Try to connect to Google
   *
   * @param access_token Token registered on user // TODO:
   */
  static google = async (access_token: string): Promise<IAuthExternalProvider> => {
    const url = 'https://www.googleapis.com/oauth2/v3/userinfo';
    const params = { access_token };
    const response = await Axios.get(url, { params });
    const { sub, name, email, picture } = response.data as { sub: number, name: string, email: string, picture: string };
    return {
      service: 'google',
      picture,
      id: sub,
      name,
      email
    };
  }

}