import {/* inject, */ BindingScope, injectable} from '@loopback/core';

const OAuthClient = require('intuit-oauth');
// Instance of client
export const clientId = process.env.CLIENT_ID;
export const clientSecret = process.env.CLIENT_SECRET;
export const redirectUri = process.env.REDIRECT_URI;

export let accessToken = '';
export let refreshToken = '';
export let accessTokenExpiresIn = 0;
export let refreshTokenExporesIn = 0;

const oauthClient = new OAuthClient({
  clientId,
  clientSecret,
  environment: 'sandbox',
  redirectUri,
});

@injectable({scope: BindingScope.TRANSIENT})
export class QuickBooksOAuthService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */
  async getAccessToken(url: string) {
    const res = (await oauthClient.createToken(url)).getJson();
    accessToken = res.access_token;
    refreshToken = res.refresh_token;
    accessTokenExpiresIn = Date.now() + res.expires_in * 1000;
    refreshTokenExporesIn = Date.now() + res.x_refresh_token_expires_in * 1000;
    console.log('ACCESS TOKEN RECEIVED');
  }
}
