import express from 'express';
import { Config } from '../config';

const serverAddr = Config.get().app.address;
const app = express();

// Microsoft
app.get('/tenantID/oauth2/authorize', (req, res) => {
  res.redirect(`${serverAddr}/microsoft/callback`);
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

// Dell
app.get('/oauth/authorize', (req, res) => {
  console.log("invoked authorize");
  res.redirect(`${serverAddr}/dell/callback`);
});
app.post('/oauth/token', (req, res) => {
  console.log("invoked token");
  res.json({ access_token: 'fake_access_token' });
});
app.get('/dell/userinfo', (req, res) => {
  console.log("invoked userinfo");
  res.json({
    "email": "fakeEmail",
    "family_name": "fakeFamilyName",
    "given_name": "fakeGivenName",
    "name": "fakeGivenName fakeFamilyName",
  });
});

const port = 8888;
app.listen(
  port,
  () => console.warn(`Xetro dummy SSO server is listening on port: ${port}!`),
);
