import * as express from 'express';
import { Service } from '../services';

export class UserRouter {
  public router: express.Router;

  constructor(service: Service) {
    this.router = express.Router();

    this.router.get('/', async (req, res) => {
      try {
        const users = await service.user.findAll();
        res.json(users);
      } catch (err) {
        console.error('error find group users:', err);
        res.sendStatus(500);
      }
    });

    this.router.get('/me', async (req, res) => {
      const me = req.session.me;
      try {
        const user = await service.user.findOne({id: me.id});
        if (user) {
          res.json(user);
        } else {
          res.sendStatus(401);
        }
      } catch (err) {
        console.error('error get me:', err);
        res.sendStatus(500);
      }
    });
  }
}
