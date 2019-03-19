const routes = require('express').Router();
const model = require('../models');

routes.get('/:id', (req, res) => {
  model.Board.findOne({
    attributes: ['name', 'id'],
    where: { id: req.params.id },
  }).then(result => {
    if (result) {
      res.json(result);
    } else {
      res.sendStatus(404);
    }
  }).catch(err => {
    res.sendStatus(500);
  });
});

routes.delete('/:id', (req, res) => {
  model.Board.destroy({
    where: { id: req.params.id },
  }).then(result => {
    res.sendStatus(204);
  }).catch(err => {
    res.sendStatus(404);
  });
});

routes.get('/', (req, res) => {
  model.Board.findAll({
    attributes: ['name', 'id'],
  }).then(boards => {
    res.json(boards);
  });
});

routes.post('/', (req, res) => {
  var board = req.body;
  model.Board.create({
    name: board.name,
    group: {
      id: req.body.groupID,
    }
  }).then((result) => {
    res.json({
      id: result.id,
      name: result.name,
    });
  }).catch(err => {
    res.sendStatus(422);
  });
});

module.exports = routes;
