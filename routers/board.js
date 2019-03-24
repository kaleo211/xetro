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

routes.get('/:id', async (req, res) => {
  await respondWithBoard(res, req.params.id);
});

routes.get('/active/:id', async (req, res) => {
  await respondWithActiveBoards(res, req.params.id);
});

routes.delete('/:id', async (req, res) => {
  try {
    await model.Board.destroy({
      where: { id: req.params.id },
    });
    res.sendStatus(204);
  } catch (err) {
    console.log('error delete board', err);
    res.sendStatus(500);
  };
});

routes.get('/', async (req, res) => {
  try {
    const boards = await model.Board.findAll({
      include: [{
        model: model.User,
        as: 'facilitator',
      }, {
        model: model.Group,
        as: 'group',
      }],
    });
    res.json(boards);
  } catch (err) {
    console.log('error list boards', err);
    res.sendStatus(500);
  };
});

routes.post('/', async (req, res) => {
  var board = req.body;
  console.log('board', board);
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
