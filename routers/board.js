const routes = require('express').Router();
const model = require('../models');
const boardSvc = require('../services/board');

const associations = [
  {
    model: model.User,
    as: 'facilitator',
  },
  {
    model: model.Group,
    as: 'group',
  },
  {
    model: model.Pillar,
    as: 'pillars',
    include: [{
      model: model.Item,
      as: 'items',
      include: [{
        model: model.Action,
        as: 'actions',
        include: [{
          model: model.User,
          as: 'owner',
        }],
      }],
    }],
  },
];

const respondWithBoard = async (res, where) => {
  try {
    const board = await model.Board.findOne({
      include: associations,
      order: [
        [{ model: model.Pillar, as: 'pillars' }, 'position', 'ASC'],
        [{ model: model.Pillar, as: 'pillars' },
          { model: model.Item, as: 'items' }, 'likes', 'DESC'],
        [{ model: model.Pillar, as: 'pillars' },
          { model: model.Item, as: 'items' }, 'createdAt', 'ASC'],
        [{ model: model.Pillar, as: 'pillars' },
          { model: model.Item, as: 'items' },
          { model: model.Action, as: 'actions' }, 'createdAt', 'ASC'],
      ],
      where,
    });
    if (board) {
      res.json(board);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error('error get board', err);
    res.sendStatus(500);
  }
};

const updateBoard = async (res, id, fields) => {
  try {
    await model.Board.update(
      fields,
      { where: { id } },
    );
    res.json({});
  } catch (err) {
    console.error('error update board', err);
    res.sendStatus(500);
  }
};

// Get
routes.get('/:id', async (req, res) => {
  await respondWithBoard(res, { id: req.params.id });
});

routes.get('/active/:groupID', async (req, res) => {
  await respondWithBoard(res, {
    groupID: req.params.groupID,
    stage: 'created',
  });
});

// Archive
routes.get('/:id/archive', async (req, res) => {
  await updateBoard(res, req.params.id, { stage: 'archived' });
});

// Lock
routes.get('/:id/lock', async (req, res) => {
  await updateBoard(res, req.params.id, {
    locked: true,
  });
});

// Unlock
routes.get('/:id/unlock', async (req, res) => {
  await updateBoard(res, req.params.id, { locked: false });
});

// List
routes.get('/group/:id', async (req, res) => {
  try {
    const boards = await model.Board.findAll({
      include: [{
        model: model.User,
        as: 'facilitator',
      }, {
        model: model.Group,
        as: 'group',
      }],
      where: {
        groupID: req.params.id,
      },
    });
    res.json(boards);
  } catch (err) {
    console.error('error list boards', err);
    res.sendStatus(500);
  }
});

// Create
routes.post('/', async (req, res) => {
  const board = req.body;
  try {
    const newBoard = await boardSvc.create(board.name, board.facilitatorID, board.groupID);
    await respondWithBoard(res, { id: newBoard.id });
  } catch (err) {
    console.error('error post board:', err);
    res.sendStatus(500);
  }
});

// Update
routes.patch('/:id', async (req, res) => {
  try {
    const board = await model.Board.findOne({
      where: { id: req.params.id },
    });
    await board.setFacilitator(req.body.facilitatorID);
    await respondWithBoard(res, { id: board.id });
  } catch (err) {
    console.error('error patch board:', err);
    res.sendStatus(500);
  }
});

module.exports = routes;
