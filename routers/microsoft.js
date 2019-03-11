const request = require('request');
const config = require('config');
const routes = require('express').Router();
const graph = require('@microsoft/microsoft-graph-client');

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

    client.api('/me').get()
      .then(user => {
        console.log('user', user);
      })
      .catch(err => console.log('error getting user profile', err));
  });

  res.sendStatus(200);
});

module.exports = routes;
