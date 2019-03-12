const request = require('request');
const config = require('config');
const routes = require('express').Router();
const graph = require('@microsoft/microsoft-graph-client');
const model = require('../models');

routes.get('/', function (req, res) {
  var tenantID = config.get('microsoft.tenant_id');
  const tokenURL = `https://login.microsoftonline.com/${tenantID}/oauth2/v2.0/token`

  request.post({
    url: tokenURL,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
    form: {
      grant_type: 'authorization_code',
      client_id: config.get('microsoft.client_id'),
      client_secret: config.get('microsoft.client_secret'),
      code: req.query.code,
      redirect_uri: config.get('microsoft.redirect_uri'),
    },
  }, (error, res, body) => {
    const parsedBody = JSON.parse(body);
    const client = graph.Client.init({
      authProvider: (done) => { done(null, parsedBody.access_token) },
    });

    client
      .api('/me')
      .get()
      .then(user => {
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
      })
      .catch(err => console.log('error getting user profile', err));
  });

  res.set('Content-Type', 'text/html');
  res.send(Buffer.from('<html><head><script>window.close();</script></head></html>'));
});

module.exports = routes;
