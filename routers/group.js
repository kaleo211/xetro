const routes = require('express').Router();
const model = require('../models');

routes.get('/:id', (req, res) => {
  model.Group.findOne({
    include: [{
      model: model.User,
      as: 'members',
      through: {},
    }],
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
  model.Group.destroy({
    where: { id: req.params.id },
  }).then(result => {
    res.sendStatus(204);
  }).catch(err => {
    res.sendStatus(404);
  });
});

routes.get('/', (req, res) => {
  model.Group.findAll({
    include: [{
      model: model.User,
      as: 'members',
      through: {},
    }],
  }).then(groups => {
    res.json(groups);
  });
});

routes.post('/', (req, res) => {
  var group = req.body;
  model.Group.create({
    name: group.name,
  }).then((result) => {
    model.Group.findOne({
      include: [{
        model: model.User,
        as: 'members',
        through: {},
      }],
      where: { id: result.id },
    }).then(result => {
      if (result) {
        res.json(result);
      } else {
        res.sendStatus(404);
      }
    }).catch(err => {
      res.sendStatus(500);
    });
  }).catch(err => {
    res.sendStatus(422);
  });
});

routes.patch('/:id', (req, res) => {
  model.Group.findOne({
    where: { id: req.params.id },
  }).then(result => {
    if (result) {
      result.addMembers(req.body.userID).then(() => {
        model.Group.findOne({
          include: [{
            model: model.User,
            as: 'members',
            through: {},
          }],
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
    } else {
      res.sendStatus(404);
    }
  }).catch(err => {
    console.log('error patch group:', err);
    res.sendStatus(500);
  });
});

module.exports = routes;
