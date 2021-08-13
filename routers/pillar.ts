import express, { Router } from 'express';
import { Service } from 'services';

export class PillarRouter {
  public router: Router;

  constructor(service: Service) {
    this.router = express.Router();

    this.router.delete('/:id', async (req, res) => {
      try {
        await service.pillar.remove(req.params.id);
        res.sendStatus(204);
      } catch (err) {
        console.error('error delete pillar', err);
        res.sendStatus(500);
      }
    });

    this.router.post('/', async (req, res) => {
      const pillar = req.body;
      try {
        const newPillar = await service.pillar.create(pillar.title, pillar.boardID);
        await respondWithPillar(res, newPillar.id);
      } catch (err) {
        console.error('error post pillar:', err);
        res.sendStatus(500);
      }
    });

    this.router.patch('/:id', async (req, res) => {
      try {
        await service.pillar.updateTitle(req.params.id, req.body.title);
        await respondWithPillar(res, req.params.id);
      } catch (err) {
        console.error('error patch pillar:', err);
        res.sendStatus(500);
      }
    });

    const respondWithPillar = async (res: express.Response, id: string) => {
      try {
        const pillar = await service.pillar.findOne({id});
        if (pillar) {
          res.json(pillar);
        } else {
          res.sendStatus(404);
        }
      } catch (err) {
        console.error('error get pillar', err);
        res.sendStatus(500);
      }
    };
  }
}
