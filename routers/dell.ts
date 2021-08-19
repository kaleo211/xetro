import * as config from 'config';
import * as express from 'express';
import { UserI } from '../types/models';
import fetch from 'node-fetch';
import { Service } from '../services';
import * as oauth from 'simple-oauth2';

export class DellRouter {
  public router: express.Router;

  constructor(service: Service) {
    this.router = express.Router();

    const ssoClientID: string = config.get('sso.dell.clientID');
    const ssoClientSecret: string = config.get('sso.dell.clientSecret');
    const ssoAuthDomain: string = config.get('sso.dell.authDomain');
    const ssoUserinfo: string = config.get('sso.dell.userinfo');

    const credentials: oauth.ModuleOptions = {
      client: {
        id: ssoClientID,
        secret: ssoClientSecret,
      },
      auth: {
        tokenHost: ssoAuthDomain,
        tokenPath: '/oauth/token',
        authorizePath: '/oauth/authorize',
      },
    };
    const selfAddress = config.get('server.address');

    this.router.get('/', (req, res) => {
      const oauth2Code = new oauth.AuthorizationCode(credentials);
      const authorizationUri = oauth2Code.authorizeURL({
        redirect_uri: selfAddress + '/dell/callback',
        scope: ['openid', 'roles', 'uaa.resource', 'user_attributes'],
      });
      res.redirect(authorizationUri);
    });


    this.router.get('/callback', async (req: express.Request, res: express.Response) => {
      const authCode = req.query.code as string;
      const options = {
        code: authCode,
        redirect_uri: selfAddress + '/dell/callback',
        scope: ['openid', 'roles', 'uaa.resource', 'user_attributes'],
      };

      try {
        const oauth2Code = new oauth.AuthorizationCode(credentials);
        const result = await oauth2Code.getToken(options);
        const token = oauth2Code.createToken(result);

        const userInfoRequest = {
          method: 'GET',
          headers: {
            Authorization: 'Bearer' + token.token.access_token,
          },
        };

        const resp = await fetch(ssoUserinfo, userInfoRequest);
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
