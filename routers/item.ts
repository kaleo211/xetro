import * as express from 'express';
import * as sequelize from 'sequelize';
import { Service } from '../services';

export class ItemRouter {
  public router: express.Router;

  constructor(service: Service) {
    this.router = express.Router();

    // Get
    this.router.get('/:id', async (req, res) => {
      await respondWithItem(res, req.params.id);
    });

    // Like
    this.router.get('/:id/like', async (req, res) => {
      updateItem(res, req.params.id, { likes: sequelize.literal('likes + 1') });
    });

    // Finish
    this.router.get('/:id/finish', async (req, res) => {
      await updateItem(res, req.params.id, { stage: 'done' });
    });

    // Start
    this.router.post('/:id/start', async (req, res) => {
      const { end } = req.body;
      await updateItem(res, req.params.id, { stage: 'active', end });
    });

    // Group Active Items
    this.router.get('/group/:id', async (req, res) => {
      // const query = { groupID: req.params.id };
      await respondWithActiveItems(res);
    });


    // Delete
    this.router.delete('/:id', async (req, res) => {
      try {
        await service.item.remove(req.params.id);
        res.sendStatus(204);
      } catch (err) {
        console.error('error delete item', err);
        res.sendStatus(500);
      }
    });

    // List
    this.router.get('/', async (req, res) => {
      try {
        const items = await service.item.findAll();
        res.json(items);
      } catch (err) {
        console.error('error list items', err);
        res.sendStatus(500);
      }
    });

    // Create
    this.router.post('/', async (req, res) => {
      const { title, ownerID, groupID, pillarID} = req.body;
      try {
        const newItem = await service.item.create(title, ownerID, groupID, pillarID);
        await respondWithItem(res, newItem.id);
      } catch (err) {
        console.error('error post item:', err);
        res.sendStatus(500);
      }
    });

    // Update
    this.router.patch('/:id', async (req, res) => {
      try {
        const item = await service.item.findOne({id: req.params.id});
        if (item) {
          item.setOwner(req.body.ownerID);
        } else {
          res.sendStatus(404);
        }
        await respondWithItem(res, req.params.id);
      } catch (err) {
        console.error('error patch item:', err);
        res.sendStatus(500);
      }
    });

    const respondWithItem = async (res: express.Response, id: string) => {
      try {
        const item = await service.item.findOne({ id });
        if (item) {
          res.json(item);
        } else {
          res.sendStatus(404);
        }
      } catch (err) {
        console.error('error get item', err);
        res.sendStatus(500);
      }
    };

    const respondWithActiveItems = async (res: express.Response) => {
      try {
        const item = await service.item.findAll();
        if (item) {
          res.json(item);
        } else {
          res.sendStatus(404);
        }
      } catch (err) {
        console.error('error get active item', err);
        res.sendStatus(500);
      }
    };

    const updateItem = async (res: express.Response, id: string, fields: object) => {
      try {
        await service.item.update(id, fields);
        respondWithItem(res, id);
      } catch (err) {
        console.error('error update board', err);
        res.sendStatus(500);
      }
    };
  }
}
