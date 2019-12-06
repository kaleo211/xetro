const config = require('config');
const routes = require('express').Router();
const rp = require('request-promise');

const model = require('../models');

routes.get('/', async (req, res) => {
  const address = config.get('sso.address');
  const tenantID = config.get('sso.tenant_id');
  const tokenURL = `${address}/${tenantID}/oauth2/v2.0/token`;

  try {
    let body = await rp.post({
      url: tokenURL,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      form: {
        grant_type: 'authorization_code',
        client_id: config.get('sso.client_id'),
        client_secret: config.get('sso.client_secret'),
        code: req.query.code,
        redirect_uri: config.get('sso.redirect_uri'),
      },
    });
    const accessToken = JSON.parse(body).access_token;
    if (accessToken == null) {
      throw new Error('error getting null access token');
    }

    body = await rp.get({
      url: `${config.get('microsoft.api')}/me`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Host: config.get('microsoft.host'),
      },
    });
    const me = JSON.parse(body);
    const email = me.mail.toLowerCase();

    const user = await model.User.findOne({
      where: { email },
    });

    if (!user) {
      console.info(`didn't find user ${email}, creating...`);
      await model.User.create({
        email,
        firstName: me.givenName,
        lastName: me.surname,
        microsoftID: me.id,
      });
    } else {
      await model.User.update({
        microsoftID: me.id,
      }, {
        where: { email }
      });
    }
    console.info(`${email} has been added to xetro`);
    req.session.me = await model.User.findOne({where: { email }});
    req.session.save();
  } catch (err) {
    console.error('error getting user profile', err);
    res.sendStatus(500);
  }

  res.set('Content-Type', 'text/html');
  res.send(Buffer.from('<html><head><script>window.close();</script></head></html>'));
});

module.exports = routes;
