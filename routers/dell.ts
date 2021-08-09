import config from 'config';
import express from 'express';
import fetch from 'node-fetch';
import { service } from 'server';
import * as oauth from 'simple-oauth2';

import { formatUserToSave } from '../utils/tool';

const routes = express.Router();

const ssoClientID: string = config.get('sso.dell.clientID');
const ssoClientSecret: string = config.get('sso.dell.clientSecret');
const ssoAuthDomain: string = config.get('sso.dell.authDomain');
const ssoUserinfo: string = config.get('sso.dell.userinfo');

const credentials: oauth.ModuleOptions = {
  client: {
    id: ssoClientID,
    secret: ssoClientSecret,
  },
  auth: {
    tokenHost: ssoAuthDomain,
    tokenPath: '/oauth/token',
    authorizePath: '/oauth/authorize',
  },
};
const selfAddress = config.get('server.address');

routes.get('/', (req, res) => {
  const oauth2Code = new oauth.AuthorizationCode(credentials);
  const authorizationUri = oauth2Code.authorizeURL({
    redirect_uri: selfAddress + '/dell/callback',
    scope: ['openid', 'roles', 'uaa.resource', 'user_attributes'],
  });
  res.redirect(authorizationUri);
});


routes.get('/callback', async (req: express.Request, res: express.Response) => {
  const authCode = req.query.code as string;
  const options = {
    code: authCode,
    redirect_uri: selfAddress + '/dell/callback',
    scope: ['openid', 'roles', 'uaa.resource', 'user_attributes'],
  };

  try {
    const oauth2Code = new oauth.AuthorizationCode(credentials);
    const result = await oauth2Code.getToken(options);
    const token = oauth2Code.createToken(result);

    const userInfoRequest = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer' + token.token.access_token,
      },
    };

    let resp = await fetch(ssoUserinfo, userInfoRequest);
    const meFromSSO = await resp.json();
    let meFromDB = await service.user.findOne({ email: meFromSSO.email });
    const meToAdd = formatUserToSave(meFromSSO);

    if (!meFromDB) {
      meFromDB = await service.user.findOrCreateByEmail(meFromSSO.email, meToAdd);
      if (!meFromDB) {
        throw new Error('invalid response from sequelize');
      }
    } else {
      const dataToAlwaysUpdate = {
        name: meToAdd.name,
      };
      await service.user.updateByEmail(meFromDB.email, dataToAlwaysUpdate);
    }
    console.info('logged successfully with user email', meFromDB.email);
    req.session.me = await service.user.findOne({ email: meFromDB.email });
    req.session.save();
    res.redirect('/');

  } catch (err) {
    console.error('error trying to log into dell: ', err.message);
    res.sendStatus(500);
  }
});


export default routes;
