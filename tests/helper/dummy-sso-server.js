const express = require('express');
const app = express();
const port = 4444;

app.get('/lifecycle/oauth2/authorize', (req, res) => {
  res.send('Hello World!');
});

app.get('/lifecycle/oauth2/v2.0/token', (req, res) => {
  res.json({ access_token: 'fake_access_token' });
});

app.listen(port, () => console.log(`Dummy SSO server listening on port ${port}!`));
