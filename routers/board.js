const routes = require('express').Router();
const Sequelize = require('sequelize');
const model = require('../models');
const boardSvc = require('../services/board');

const Op = Sequelize.Op;

const associations = [
  {
    model: model.User,
    as: 'facilitator',
  }, {
    model: model.Group,
    as: 'group',
  }, {
    model: model.Pillar,
    as: 'pillars',
    order: [['createdAt', 'ASC']],
    include: [
      {
        model: model.Item,
        as: 'items',
        order: [['createdAt', 'ASC']],
        include: [
          {
            model: model.Item,
            as: 'actions',
            order: [['createdAt', 'ASC']],
          },
        ],
      },
    ],
  }, {
    model: model.Item,
    as: 'items',
    required: false,
    where: {
      type: 'action',
      stage: {
        [Op.ne]: 'done',
      },
    },
  },
];

const respondWithBoard = async (res, id) => {
  try {
    const board = await model.Board.findOne({
      include: associations,
      where: { id },
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

const respondWithActiveBoards = async (res, groupID) => {
  try {
    const board = await model.Board.findOne({
      include: associations,
      where: {
        groupID,
        stage: {
          [Op.ne]: 'archived',
        },
      },
    });
    if (board) {
      res.json(board);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error('error get active board', err);
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
  await respondWithBoard(res, req.params.id);
});

// List Active
routes.get('/active/:id', async (req, res) => {
  await respondWithActiveBoards(res, req.params.id);
});

// Archive
routes.get('/:id/archive', async (req, res) => {
  await updateBoard(res, req.params.id, { stage: 'archived' });
});

// Lock
routes.get('/:id/lock', async (req, res) => {
  await updateBoard(res, req.params.id, {
    locked: true,
    stage: 'active',
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
    const newBoard = await boardSvc.create(board.name, board.facilitatorId, board.groupID);
    await respondWithBoard(res, newBoard.id);
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
    await board.setFacilitator(req.body.facilitatorId);
    await respondWithBoard(res, board.id);
  } catch (err) {
    console.error('error patch board:', err);
    res.sendStatus(500);
  }
});

module.exports = routes;
