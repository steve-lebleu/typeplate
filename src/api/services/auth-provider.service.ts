import { default as Axios } from 'axios';

import { Logger } from '@services/logger.service';
import { IOauthResponse } from '@interfaces/IOauthResponse.interface';

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
  static facebook = async (access_token: string): Promise<IOauthResponse> => {
    const fields = 'id,name,email,picture';
    const url = 'https://graph.facebook.com/me';
    const params = { access_token, fields };

    const response = await Axios.get(url, { params }).catch(e => Logger.log('error', e.response.data.error.message)) as { data };
    const { emails, name } = response.data as IOauthResponse;

    if (!emails) {
      Logger.log('info', `User ${name.givenName} ${name.familyName} have not shared her email address from facebook`);
    }

    return response.data as IOauthResponse;
  }

  /**
   * @description Try to connect to Google
   *
   * @param access_token Token registered on user
   *
   * @deprecated
   */
  static google = async (access_token: string): Promise<IOauthResponse> => {
    const url = 'https://www.googleapis.com/oauth2/v3/userinfo';
    const params = { access_token };
    const response = await Axios.get(url, { params }).catch(e => Logger.log('error', e.response.data.error.message)) as { data };
    const { emails, name } = response.data as IOauthResponse;

    if (!emails) {
      Logger.log('info', `User ${name.givenName} ${name.familyName} have not shared her email address from Google`);
    }

    return response.data as IOauthResponse;
  }

}