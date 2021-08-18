import express, { Router } from 'express';
import { Service } from '../services';

export class SocketRouter {
  public router: Router;

  constructor(service: Service) {
    this.router = express.Router();

    this.router.get('/', (req, res) => {
      res.send({ response: 'I am alive' }).status(200);
    });
  }
}
