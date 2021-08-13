import express, { Router } from 'express';
import { Service } from 'services';

export class ActionRouter {
  public router: Router;

  constructor(service: Service) {
    this.router = express.Router();

    // Finish
    this.router.get('/:id/finish', async (req, res) => {
      await updateAction(res, req.params.id, { stage: 'done' });
    });

    // Start
    this.router.get('/:id/start', async (req, res) => {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 5);
      await updateAction(res, req.params.id, { stage: 'active', end: new Date(now) });
    });

    // Group Active Actions
    this.router.get('/group/:id', async (req, res) => {
      const query = { groupID: req.params.id };
      await respondWithActions(res, query);
    });

    // Delete
    this.router.delete('/:id', async (req, res) => {
      try {
        await service.action.remove(req.params.id);
        res.sendStatus(204);
      } catch (err) {
        console.error('error delete action', err);
        res.sendStatus(500);
      }
    });

    // Create
    this.router.post('/', async (req, res) => {
      const { title, ownerID, groupID, boardID, itemID } = req.body;
      try {
        const newAction = await service.action.create(title, ownerID, groupID, boardID, itemID);
        await respondWithAction(res, newAction.id);
      } catch (err) {
        console.error('error post action:', err);
        res.sendStatus(500);
      }
    });

    // Update
    this.router.patch('/:id', async (req, res) => {
      try {
        const action = await service.action.findOne({id: req.params.id});
        if (action) {
          action.setOwner(req.body.ownerID);
        } else {
          res.sendStatus(404);
        }
        await respondWithAction(res, req.params.id);
      } catch (err) {
        console.error('error patch action:', err);
        res.sendStatus(500);
      }
    });

    const respondWithAction = async (res: express.Response, id: string) => {
      try {
        const action = await service.action.findOne({id});
        if (action) {
          res.json(action);
        } else {
          res.sendStatus(404);
        }
      } catch (err) {
        console.error('error get action', err);
        res.sendStatus(500);
      }
    };

    const respondWithActions = async (res: express.Response, query: object) => {
      try {
        const actions = await service.action.findAll({
          ...query,
          stage: ['created', 'started'],
        });
        if (actions) {
          res.json(actions);
        } else {
          res.sendStatus(404);
        }
      } catch (err) {
        console.error('error get active actions', err);
        res.sendStatus(500);
      }
    };

    const updateAction = async (res: express.Response, id: string, fields: object) => {
      try {
        await service.action.update(id, fields);
        await respondWithAction(res, id);
      } catch (err) {
        console.error('error update board', err);
        res.sendStatus(500);
      }
    };
  }
}

