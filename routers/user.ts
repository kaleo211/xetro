import express from 'express';
import { service } from 'server';

const routes = express.Router();

routes.get('/', async (req, res) => {
  try {
    const users = await service.user.findAll();
    res.json(users);
  } catch (err) {
    console.error('error find group users:', err);
    res.sendStatus(500);
  }
});

routes.get('/me', async (req, res) => {
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

export default routes;
