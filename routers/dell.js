import config from 'config';
import express from 'express';
import fetch from 'node-fetch';
import oauth from 'simple-oauth2';

import { formatUserToSave } from '../utils/tool';
import userSvc from '../services/user';

const routes = express.Router();

const ssoClientID = config.get('sso.dell.clientID');
const ssoClientSecret = config.get('sso.dell.clientSecret');
const ssoAuthDomain = config.get('sso.dell.authDomain');
const ssoUserinfo = config.get('sso.dell.userinfo');

const oauth2client = oauth.create({
  client: {
    id: ssoClientID,
    secret: ssoClientSecret,
  },
  auth: {
    tokenHost: ssoAuthDomain,
    tokenPath: '/oauth/token',
    authorizePath: '/oauth/authorize',
  },
});
const selfAddress = config.get('server.address');

routes.get('/', (req, res) => {
  const authorizationUri = oauth2client.authorizationCode.authorizeURL({
    redirect_uri: selfAddress + '/dell/callback',
    scope: ['openid', 'roles', 'uaa.resource', 'user_attributes'],
  });
  res.redirect(authorizationUri);
});


routes.get('/callback', async (req, res, next) => {
  const authCode = req.query.code;
  const options = {
    code: authCode,
    redirect_uri: selfAddress + '/dell/callback',
    scope: ['openid', 'roles', 'uaa.resource', 'user_attributes'],
  };

  try {
    const result = await oauth2client.authorizationCode.getToken(options);
    const token = oauth2client.accessToken.create(result);

    const userInfoRequest = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer' + token.token.access_token,
      },
    };

    let resp = await fetch(ssoUserinfo, userInfoRequest);
    const meFromSSO = await resp.json();
    let meFromDB = await userSvc.findOne({ email: meFromSSO.email });
    const meToAdd = formatUserToSave(meFromSSO);

    if (!meFromDB) {
      resp = await userSvc.findOrCreateByEmail(meFromSSO.email, meToAdd);
      if (!resp || resp.length !== 2) {
        throw new Error('invalid response from sequelize');
      }
      meFromDB = resp[0].toJSON();
    } else {
      const dataToAlwaysUpdate = {
        name: meToAdd.name,
        title: meToAdd.title,
      };
      await userSvc.updateByEmail(meFromDB.email, dataToAlwaysUpdate);
    }
    console.info('logged successfully with user email', meFromDB.email);
    req.session.me = await userSvc.findOne({ email: meFromDB.email });
    req.session.save();
    res.redirect('/');
  } catch (err) {
    console.error('error trying to log into dell: ', err.message);
    res.sendStatus(500);
  }
});


export default routes;
