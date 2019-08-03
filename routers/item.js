const routes = require('express').Router();
const sequelize = require('sequelize');
const model = require('../models');

const associations = [
  {
    model: model.User,
    as: 'owner',
  }, {
    model: model.Group,
    as: 'group',
  }, {
    model: model.Pillar,
    as: 'pillar',
  }, {
    model: model.Item,
    as: 'item',
  }, {
    model: model.Item,
    as: 'actions',
  },
];

const respondWithItem = async (res, id) => {
  try {
    const item = await model.Item.findOne({
      include: associations,
      where: {
        id,
      },
    });
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
    const item = await model.Item.findAll({
      include: associations,
      where: {
        ...query,
        stage: 'active',
      },
      order: [['createdAt', 'DESC']],
    });
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
    await model.Item.update(
      fields,
      { where: { id } },
    );
    respondWithItem(res, id);
  } catch (err) {
    console.error('error update board', err);
    res.sendStatus(500);
  }
};

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
  const query = { groupId: req.params.id };
  await respondWithActiveItems(res, query);
});

// User Items
// routes.get('/user/:id', async (req, res) => {
//   await respondWithUserItems(res, { ownerId: req.params.id });
// });

// Delete
routes.delete('/:id', async (req, res) => {
  try {
    await model.Item.destroy({
      where: { id: req.params.id },
    });
    res.sendStatus(204);
  } catch (err) {
    console.error('error delete item', err);
    res.sendStatus(500);
  }
});

// List
routes.get('/', async (req, res) => {
  try {
    const items = await model.Item.findAll({
      include: [{
        model: model.User,
        as: 'facilitator',
      }, {
        model: model.Group,
        as: 'group',
      }],
    });
    res.json(items);
  } catch (err) {
    console.error('error list items', err);
    res.sendStatus(500);
  }
});

// Create
routes.post('/', async (req, res) => {
  const item = req.body;
  try {
    const newItem = await model.Item.create({
      title: item.title,
      type: item.type,
    });
    await newItem.setOwner(item.ownerId);
    await newItem.setPillar(item.pillarId);
    await newItem.setGroup(item.groupId);
    await newItem.setBoard(item.boardId);
    await newItem.setItem(item.itemId);
    await respondWithItem(res, newItem.id);
  } catch (err) {
    console.error('error post item:', err);
    res.sendStatus(500);
  }
});

// Update
routes.patch('/:id', async (req, res) => {
  try {
    const item = await model.Item.findOne({
      include: associations,
      where: {
        id: req.params.id,
      },
    });
    if (item) {
      item.setOwner(req.body.ownerId);
    } else {
      res.sendStatus(404);
    }
    await respondWithItem(res, req.params.id);
  } catch (err) {
    console.error('error patch item:', err);
    res.sendStatus(500);
  }
});

module.exports = routes;
