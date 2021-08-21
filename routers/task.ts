import * as express from 'express';
import { Service } from '../services';

export class TaskRouter {
  public router: express.Router;

  constructor(service: Service) {
    this.router = express.Router();

    // Finish
    this.router.get('/:id/finish', async (req, res) => {
      await updateTask(res, req.params.id, { stage: 'done' });
    });

    // Start
    this.router.get('/:id/start', async (req, res) => {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 5);
      await updateTask(res, req.params.id, { stage: 'active', end: new Date(now) });
    });

    // Group Active Tasks
    this.router.get('/group/:id', async (req, res) => {
      const query = { groupID: req.params.id };
      await respondWithTasks(res, query);
    });

    // Delete
    this.router.delete('/:id', async (req, res) => {
      try {
        await service.task.remove(req.params.id);
        res.sendStatus(204);
      } catch (err) {
        console.error('error delete task', err);
        res.sendStatus(500);
      }
    });

    // Create
    this.router.post('/', async (req, res) => {
      const { title, ownerID, groupID, boardID, itemID } = req.body;
      try {
        const newTask = await service.task.create(title, ownerID, groupID, boardID, itemID);
        await respondWithTask(res, newTask.id);
      } catch (err) {
        console.error('error post task:', err);
        res.sendStatus(500);
      }
    });

    // Update
    this.router.patch('/:id', async (req, res) => {
      try {
        const task = await service.task.findOne({id: req.params.id});
        if (task) {
          task.setOwner(req.body.ownerID);
        } else {
          res.sendStatus(404);
        }
        await respondWithTask(res, req.params.id);
      } catch (err) {
        console.error('error patch task:', err);
        res.sendStatus(500);
      }
    });

    const respondWithTask = async (res: express.Response, id: string) => {
      try {
        const task = await service.task.findOne({id});
        if (task) {
          res.json(task);
        } else {
          res.sendStatus(404);
        }
      } catch (err) {
        console.error('error get task', err);
        res.sendStatus(500);
      }
    };

    const respondWithTasks = async (res: express.Response, query: object) => {
      try {
        const tasks = await service.task.findAll({
          ...query,
          stage: ['created', 'started'],
        });
        if (tasks) {
          res.json(tasks);
        } else {
          res.sendStatus(404);
        }
      } catch (err) {
        console.error('error get active tasks', err);
        res.sendStatus(500);
      }
    };

    const updateTask = async (res: express.Response, id: string, fields: object) => {
      try {
        await service.task.update(id, fields);
        await respondWithTask(res, id);
      } catch (err) {
        console.error('error update board', err);
        res.sendStatus(500);
      }
    };
  }
}

