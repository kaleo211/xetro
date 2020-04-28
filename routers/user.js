import express from 'express';
import userSvc from '../services/user';

const routes = express.Router();

routes.get('/', async (req, res) => {
  try {
    const users = await userSvc.findAll();
    res.json(users);
  } catch (err) {
    console.error('error find group users:', err);
    res.sendStatus(500);
  }
});

routes.get('/me', async (req, res) => {
  const me = req.session.me;
  try {
    const user = await userSvc.findOne({id: me.id});
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
