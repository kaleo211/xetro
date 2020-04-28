import express from 'express';
import sequelize from 'sequelize';
import itemSvc from '../services/item.js';

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
routes.get('/:id/start', async (req, res) => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 5);
  await updateItem(res, req.params.id, { stage: 'active', end: new Date(now) });
});

// Group Active Items
routes.get('/group/:id', async (req, res) => {
  const query = { groupID: req.params.id };
  await respondWithActiveItems(res, query);
});


// Delete
routes.delete('/:id', async (req, res) => {
  try {
    await itemSvc.remove(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    console.error('error delete item', err);
    res.sendStatus(500);
  }
});

// List
routes.get('/', async (req, res) => {
  try {
    const items = await itemSvc.findAll();
    res.json(items);
  } catch (err) {
    console.error('error list items', err);
    res.sendStatus(500);
  }
});

// Create
routes.post('/', async (req, res) => {
  const { title, ownerID, groupID, pillarID} = req.body.item;
  try {
    await itemSvc.create(title, ownerID, groupID, pillarID);
    await respondWithItem(res, newItem.id);
  } catch (err) {
    console.error('error post item:', err);
    res.sendStatus(500);
  }
});

// Update
routes.patch('/:id', async (req, res) => {
  try {
    const item = await itemSvc.findOne({id: req.params.id});
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



const respondWithItem = async (res, id) => {
  try {
    const item = await itemSvc.findOne({ id });
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

const respondWithActiveItems = async (res, query) => {
  try {
    const item = await itemSvc.findAll();
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

const updateItem = async (res, id, fields) => {
  try {
    await itemSvc.update(id, fields);
    respondWithItem(res, id);
  } catch (err) {
    console.error('error update board', err);
    res.sendStatus(500);
  }
};


export default routes;
