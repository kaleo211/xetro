import config from 'config';
import express from 'express';
import rp from 'request-promise';
import userSvc from '../services/user.ja';

const routes = express.Router();

routes.get('/', async (req, res) => {
  const address = config.get('sso.microsoft.address');
  const tenantID = config.get('sso.microsoft.tenant_id');
  const tokenURL = `${address}/${tenantID}/oauth2/v2.0/token`;

  try {
    let body = await rp.post({
      url: tokenURL,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      form: {
        grant_type: 'authorization_code',
        client_id: config.get('sso.microsoft.client_id'),
        client_secret: config.get('sso.microsoft.client_secret'),
        code: req.query.code,
        redirect_uri: config.get('sso.microsoft.redirect_uri'),
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

    const user = await userSvc.findOne({
      where: { email },
    });

    if (!user) {
      console.info(`didn't find user ${email}, creating...`);
      await userSvc.create(email, me.givenName, me.surname, me.id);
    } else {
      await userSvc.updateMicrosoftID(email, me.id);
    }
    console.info(`${email} has been added to xetro`);
    req.session.me = await userSvc.findOne({where: { email }});
    req.session.save();
  } catch (err) {
    console.error('error getting user profile', err);
    res.sendStatus(500);
  }

  res.set('Content-Type', 'text/html');
  res.send(Buffer.from('<html><head><script>window.close();</script></head></html>'));
});

export default routes;
