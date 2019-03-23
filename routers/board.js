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

routes.get('/:id', async (req, res) => {
  await respondWithBoard(res, req.params.id);
});

routes.delete('/:id', async (req, res) => {
  try {
    await model.Group.destroy({
      where: { id: req.params.id },
    });
    res.sendStatus(204);
  } catch (err) {
    console.log('error delete group', err);
    res.sendStatus(500);
  };
});

routes.get('/', async (req, res) => {
  try {
    const groups = await model.Group.findAll({
      include: [{
        model: model.User,
        as: 'facilitator',
      }, {
        model: model.Board,
        as: 'board',
      }],
    });
    res.json(groups);
  } catch (err) {
    console.log('error delete group', err);
    res.sendStatus(500);
  };
});

routes.post('/', async (req, res) => {
  var board = req.body;
  console.log('new board:', board);

  try {
    const newBoard = await model.Board.create({
      name: board.name
    });
    await newBoard.setFacilitator(board.facilitatorID);
    await newBoard.setGroup(board.groupID);

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
    await board.addFacilitator(req.body.facilitatorID);
    await respondWithBoard(res, board.id);
  } catch (err) {
    console.log('error patch board:', err);
    res.sendStatus(500);
  };
});

module.exports = routes;
