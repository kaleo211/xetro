import * as express from 'express';
import * as oauth from 'simple-oauth2';
import fetch from 'node-fetch';

import { Service } from 'services';
import { UserI } from 'types/models';
import { Config } from '../config';

export class DellRouter {
  public router: express.Router;

  constructor(service: Service) {
    this.router = express.Router();

    const dellConfig = Config.get().dell;
    const credentials: oauth.ModuleOptions = {
      client: {
        id: dellConfig.clientID,
        secret: dellConfig.clientSecret,
      },
      auth: {
        tokenHost: dellConfig.authDomain,
        tokenPath: '/oauth/token',
        authorizePath: '/oauth/authorize',
      },
    };
    const selfAddress = Config.get().app.address;

    this.router.get('/', (req, res) => {
      const oauth2Code = new oauth.AuthorizationCode(credentials);
      const authorizationUri = oauth2Code.authorizeURL({
        redirect_uri: selfAddress + '/dell/callback',
        scope: ['openid', 'uaa.resource', 'user_attributes', 'user.read', 'profile'],
      });
      res.redirect(authorizationUri);
    });

    this.router.get('/callback', async (req: express.Request, res: express.Response) => {
      const authCode = req.query.code as string;
      const options = {
        code: authCode,
        redirect_uri: selfAddress + '/dell/callback',
        scope: ['openid', 'uaa.resource', 'user_attributes', 'user.read', 'profile'],
      };

      try {
        const oauth2Code = new oauth.AuthorizationCode(credentials);
        const token = await oauth2Code.getToken(options);
        const userInfoRequest = {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + token.token.access_token,
          },
        };

        const resp = await fetch(dellConfig.userinfo, userInfoRequest);
        const meFromSSO = await resp.json();

        await service.user.findAll();
        let meFromDB = await service.user.findOne({ email: meFromSSO.email });
        const meToAdd:UserI = { firstName: meFromSSO.given_name, lastName: meFromSSO.family_name, email: meFromSSO.email };

        if (!meFromDB) {
          meFromDB = await service.user.findOrCreateByEmail(meFromSSO.email, meToAdd);
          if (!meFromDB) {
            throw new Error('invalid response from sequelize');
          }
        } else {
          const dataToAlwaysUpdate = {
            name: meToAdd.name,
          };
          await service.user.updateByEmail(meFromDB.email, dataToAlwaysUpdate);
        }
        console.info('logged successfully with user email', meFromDB.email);
        req.session.me = await service.user.findOne({ email: meFromDB.email });
        req.session.save();
        res.redirect('/');

      } catch (err) {
        console.error('error trying to log into dell: ', err);
        res.sendStatus(500);
      }
    });
  }
}
