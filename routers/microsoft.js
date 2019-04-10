const config = require('config');
const routes = require('express').Router();
const model = require('../models');
const rp = require('request-promise');

routes.get('/', async (req, res) => {
  var address = config.get('sso.address')
  var tenantID = config.get('sso.tenant_id');
  const tokenURL = `${address}/${tenantID}/oauth2/v2.0/token`

  try {

    let body = await rp.post({
      url: tokenURL,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
      form: {
        grant_type: 'authorization_code',
        client_id: config.get('sso.client_id'),
        client_secret: config.get('sso.client_secret'),
        code: req.query.code,
        redirect_uri: config.get('sso.redirect_uri'),
      },
    });
    const authorization = JSON.parse(body);

    let body = rp.get({
      url: `${config.get('microsoft.api')}/me`,
      headers: {
        'Authorization': `Bearer ${authorization.access_token}`,
        'Host': config.get('microsoft.host'),
      }
    });
    const user = JSON.parse(body);

    model.User.findOrCreate({
      where: { email: user.mail.toLowerCase() },
      defaults: {
        firstName: user.givenName,
        lastName: user.surname,
        microsoftID: user.id,
      }
    }).spread((user, created) => {
      req.session.user = user;
      req.session.save();
    });
  } catch (err) {
    console.log('error getting user profile', err);
    res.sendStatus(500);
  }

  res.set('Content-Type', 'text/html');
  res.send(Buffer.from('<html><head><script>window.close();</script></head></html>'));
});

module.exports = routes;
