import { default as Axios } from 'axios';

import { IOauth } from '@interfaces/IOauth.interface';
import { Logger } from '@services/logger.service';

/**
 * @deprecated
 */
export class AuthProvider {

  constructor() {}

  /**
   * @description Try to connect to Facebook
   *
   * @param access_token Token registered on user
   *
   * @deprecated
   *
   */
  static facebook = async (access_token: string): Promise<IOauth> => {
    console.log('FACEBOOK AUTH PROVIDER CALLED');
    const fields = 'id,name,email,picture';
    const url = 'https://graph.facebook.com/me';
    const params = { access_token, fields };

    const response = await Axios.get(url, { params }).catch(e => Logger.log('error', e.response.data.error.message)) as { data };
    console.log('response', response.data)
    const { id, name, email, picture } = response.data as { id: number, name: string, email: string, picture: { data: { url: string } } };

    if (!email) {
      Logger.log('info', `User ${name} have not shared her email address from facebook`);
    }

    return {
      picture: picture.data.url,
      id,
      username: name,
      email
    };
  }

  /**
   * @description Try to connect to Google
   *
   * @param access_token Token registered on user
   *
   * @deprecated
   */
  static google = async (access_token: string): Promise<IOauth> => {
    const url = 'https://www.googleapis.com/oauth2/v3/userinfo';
    const params = { access_token };
    const response = await Axios.get(url, { params });
    const { sub, name, email, picture } = response.data as { sub: number, name: string, email: string, picture: string };
    return {
      picture,
      id: sub,
      username: name,
      email
    };
  }

}