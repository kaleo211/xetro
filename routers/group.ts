import * as express from 'express';
import { Service } from '../services';

export class GroupRouter {
  public router: express.Router;

  constructor(service: Service) {
    this.router = express.Router();

    this.router.get('/:id', async (req, res) => {
      respondWithGroup(res, req.params.id);
    });

    this.router.delete('/:id', async (req, res) => {
      try {
        await service.group.remove(req.params.id);
        res.sendStatus(204);
      } catch (err) {
        console.error('error delete group', err);
        res.sendStatus(500);
      }
    });

    this.router.post('/search', async (req, res) => {
      const { name } = req.body;
      try {
        const groups = await service.group.searchByName(name);
        res.json(groups);
      } catch (err) {
        console.error('error search group:', err);
        res.sendStatus(500);
      }
    });

    this.router.post('/', async (req, res) => {
      const group = req.body;
      try {
        const newGroup = await service.group.findOrCreateByName(group.name);
        if (!newGroup) {
          console.error('error finding unique group:');
          res.sendStatus(500);
          return;
        }
        group.members && group.members.map(async (id: string) => {
          await newGroup.addMembers(id);
        });
        await respondWithGroup(res, newGroup.id);
      } catch (err) {
        console.error('error post group:', err);
        res.sendStatus(500);
      }
    });

    this.router.post('/member', async (req, res) => {
      try {
        const { userID, groupID } = req.body;
        if (userID && groupID) {
          await service.group.addMember(groupID, userID);
          await respondWithGroup(res, groupID);
        } else {
          res.sendStatus(400);
        }
      } catch (err) {
        console.error('error patch group:', err);
        res.sendStatus(500);
      }
    });

    this.router.post('/facilitator', async (req, res) => {
      try {
        const { groupID, facilitatorID } = req.body;
        await service.group.setFacilitator(groupID, facilitatorID);
        await respondWithGroup(res, groupID);
      } catch (err) {
        console.error('error patch group:', err);
        res.sendStatus(500);
      }
    });

    const respondWithGroup = async (res: express.Response, id: string) => {
      try {
        const group = await service.group.findOne({ id });
        if (group) {
          res.json(group);
        } else {
          res.sendStatus(404);
        }
      } catch (err) {
        console.error('error get group', err);
        res.sendStatus(500);
      }
    };
  }
}
