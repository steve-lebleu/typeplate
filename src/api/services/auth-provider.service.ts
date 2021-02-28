import { default as Axios } from 'axios';
import { getCustomRepository } from 'typeorm';

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
  facebook = async (access_token: string) => {
    const fields = 'id, name, email, picture';
    const url = 'https://graph.facebook.com/me';
    const params = { access_token, fields };
    const response = await Axios.get(url, { params });
    const {
      id, name, email, picture,
    } = response.data;
    return {
      service: 'facebook',
      picture: picture.data.url,
      id,
      name,
      email,
    };
  };

  /**
   * @description Try to connect to Google
   *
   * @param access_token Token registered on user // TODO:
   */
  google = async (access_token: string) => {
    const url = 'https://www.googleapis.com/oauth2/v3/userinfo';
    const params = { access_token };
    const response = await Axios.get(url, { params });
    const {
      sub, name, email, picture,
    } = response.data;
    return {
      service: 'google',
      picture,
      id: sub,
      name,
      email,
    };
  };

}