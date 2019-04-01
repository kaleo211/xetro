const routes = require('express').Router();
const model = require('../models');

var respondWithBoard = async (res, id) => {
  try {
    const board = await model.Board.findOne({
      include: [{
        model: model.User,
        as: 'facilitator',
      }, {
        model: model.Group,
        as: 'group',
      }, {
        model: model.Pillar,
        as: 'pillars',
        order: [['createdAt', 'ASC']],
        include: [{
          model: model.Item,
          as: 'items',
          order: [['createdAt', 'ASC']],
        }],
      }],
      where: { id: id },
    });
    if (board) {
      res.json(board);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log('error get board', err);
    res.sendStatus(500);
  };
}

var respondWithActiveBoards = async (res, groupId) => {
  try {
    const board = await model.Board.findAll({
      include: [{
        model: model.User,
        as: 'facilitator',
      }, {
        model: model.Group,
        as: 'group',
      }],
      where: {
        groupId: groupId,
        stage: 'active',
      },
    });
    if (board) {
      res.json(board);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log('error get active board', err);
    res.sendStatus(500);
  };
}

var updateBoard = async (res, id, fields) => {
  try {
    await model.Board.update(
      fields,
      { where: { id: id } }
    );
    res.json({});
  } catch (err) {
    console.log('error update board', err);
    res.sendStatus(500);
  };
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
  await updateBoard(res, req.params.id, { locked: true });
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
        groupId: req.params.id,
      },
    });
    res.json(boards);
  } catch (err) {
    console.log('error list boards', err);
    res.sendStatus(500);
  };
});

// Create
routes.post('/', async (req, res) => {
  var board = req.body;
  try {
    const newBoard = await model.Board.create({
      name: board.name,
      stage: board.stage,
    });
    await newBoard.setFacilitator(board.facilitatorId);
    await newBoard.setGroup(board.groupId);

    await respondWithBoard(res, newBoard.id);
  } catch (err) {
    console.log('error post board:', err);
    res.sendStatus(500);
  };
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
    console.log('error patch board:', err);
    res.sendStatus(500);
  };
});

module.exports = routes;
