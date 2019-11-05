const express = require('express');

const app = express();
const port = 8888;

app.get('/tenantID/oauth2/authorize', (req, res) => {
  res.redirect('http://localhost:8080/callback');
});

app.post('/tenantID/oauth2/v2.0/token', (req, res) => {
  res.json({ access_token: 'fake_access_token' });
});

app.get('/me', (req, res) => {
  res.json({
    mail: 'fakeEamil',
    givenName: 'TheElephant',
    surname: 'Cage',
    microsoftID: '79499A9B-6023-4FAC-B594-7626312BC6BD',
  });
});

app.listen(port, () => console.warn(`Dummy SSO server listening on port ${port}!`));
