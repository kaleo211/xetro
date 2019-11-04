const routes = require('express').Router();
const model = require('../models');

const associations = [
  {
    model: model.User,
    as: 'owner',
  },
  {
    model: model.Group,
    as: 'group',
  },
  {
    model: model.Item,
    as: 'item',
  },
];

const respondWithAction = async (res, id) => {
  try {
    const action = await model.Action.findOne({
      include: associations,
      where: {
        id,
      },
    });
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

const respondWithActions = async (res, query) => {
  try {
    const actions = await model.Action.findAll({
      include: associations,
      where: {
        ...query,
        stage: ['created', 'started'],
      },
      order: [['createdAt', 'DESC']],
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

const updateAction = async (res, id, fields) => {
  try {
    await model.Action.update(
      fields,
      { where: { id } },
    );
    respondWithAction(res, id);
  } catch (err) {
    console.error('error update board', err);
    res.sendStatus(500);
  }
};

// Finish
routes.get('/:id/finish', async (req, res) => {
  await updateAction(res, req.params.id, { stage: 'done' });
});

// Start
routes.get('/:id/start', async (req, res) => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 5);
  await updateAction(res, req.params.id, { stage: 'active', end: new Date(now) });
});

// Group Active Actions
routes.get('/group/:id', async (req, res) => {
  const query = { groupID: req.params.id };
  await respondWithActions(res, query);
});

// Delete
routes.delete('/:id', async (req, res) => {
  try {
    await model.Action.destroy({
      where: { id: req.params.id },
    });
    res.sendStatus(204);
  } catch (err) {
    console.error('error delete action', err);
    res.sendStatus(500);
  }
});

// Create
routes.post('/', async (req, res) => {
  const action = req.body;
  try {
    const newAction = await model.Action.create({
      title: action.title,
    });
    await newAction.setOwner(action.ownerID);
    await newAction.setGroup(action.groupID);
    await newAction.setBoard(action.boardID);
    await respondWithAction(res, newAction.id);
  } catch (err) {
    console.error('error post action:', err);
    res.sendStatus(500);
  }
});

// Update
routes.patch('/:id', async (req, res) => {
  try {
    const action = await model.Action.findOne({
      where: {
        id: req.params.id,
      },
    });
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

module.exports = routes;
