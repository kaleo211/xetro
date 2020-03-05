const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const config = require('config');
const oauth = require('simple-oauth2');

const models = require('../models');
const { formatUserToSave } = require('../utils/tool');

const ssoClientID = config.get('sso.dell.client_id');
const ssoClientSecret = config.get('sso.dell.client_secret');
const ssoAuthDomain = config.get('sso.dell.auth_domain');

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

router.get('/', (req, res) => {
  const authorizationUri = oauth2client.authorizationCode.authorizeURL({
    redirect_uri: selfAddress + '/dell/callback',
    scope: ['openid', 'roles', 'uaa.resource', 'user_attributes'],
  });
  res.redirect(authorizationUri);
});

router.get('/callback', async (req, res, next) => {
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

    let resp = await fetch(config.get('services.userinfo.url'), userInfoRequest);
    const meFromSSO = await resp.json();
    let meFromDB = await models.User.findOne({
      where: { email: meFromSSO.email },
    });
    const meToAdd = formatUserToSave(meFromSSO);

    if (!meFromDB) {
      resp = await models.User.findOrCreate({
        where: { email: meFromSSO.email },
        defaults: meToAdd,
      });
      if (!resp || resp.length !== 2) {
        throw new Error('invalid response from sequelize');
      }
      meFromDB = resp[0].toJSON();
    } else {
      const dataToAlwaysUpdate = {
        name: meToAdd.name,
        title: meToAdd.title,
      };
      await models.User.update(dataToAlwaysUpdate, {
        where: { email: meFromDB.email },
      });
    }
    req.session.me = await models.User.findOne({where: { email: meFromDB.email }});
    req.session.save();
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from('<html><head><script>window.close();</script></head></html>'));
  } catch (err) {
    console.error('error trying to log into dell: ', err.message);
    res.sendStatus(500);
  }
});

module.exports = router;
