import * as express from 'express';
import { Service } from '../services';

export class SocketRouter {
  public router: express.Router;

  constructor(service: Service) {
    this.router = express.Router();

    this.router.get('/', (req, res) => {
      res.send({ response: 'I am alive' }).status(200);
    });
  }
}
