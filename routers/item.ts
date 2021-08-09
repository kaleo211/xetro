import express from 'express';
import sequelize from 'sequelize';
import { service } from 'server';

const routes = express.Router();


// Get
routes.get('/:id', async (req, res) => {
  await respondWithItem(res, req.params.id);
});

// Like
routes.get('/:id/like', async (req, res) => {
  updateItem(res, req.params.id, { likes: sequelize.literal('likes + 1') });
});

// Finish
routes.get('/:id/finish', async (req, res) => {
  await updateItem(res, req.params.id, { stage: 'done' });
});

// Start
routes.post('/:id/start', async (req, res) => {
  const { end } = req.body;
  await updateItem(res, req.params.id, { stage: 'active', end });
});

// Group Active Items
routes.get('/group/:id', async (req, res) => {
  // const query = { groupID: req.params.id };
  await respondWithActiveItems(res);
});


// Delete
routes.delete('/:id', async (req, res) => {
  try {
    await service.item.remove(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    console.error('error delete item', err);
    res.sendStatus(500);
  }
});

// List
routes.get('/', async (req, res) => {
  try {
    const items = await service.item.findAll();
    res.json(items);
  } catch (err) {
    console.error('error list items', err);
    res.sendStatus(500);
  }
});

// Create
routes.post('/', async (req, res) => {
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
routes.patch('/:id', async (req, res) => {
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


export default routes;
