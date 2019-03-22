const routes = require('express').Router();
const model = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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


routes.post('/search', (req, res) => {
  console.log('req:', req.body);
  var name = req.body.name;

  model.Group.findAll({
    include: [{
      model: model.User,
      as: 'members',
      through: {},
    }],
    where: {
      name: { [Op.like]: `%${name}%` }
    },
  }).then(results => {
    if (results) {
      res.json(results);
    } else {
      res.sendStatus(404);
    }
  }).catch(err => {
    console.log('error search group:', err);
    res.sendStatus(500);
  });
});

routes.post('/', async (req, res) => {
  var group = req.body;
  const newGroups = await model.Group.findOrCreate({
    where: { name: group.name },
  });

  if (newGroups.length != 1) {
    console.log('error finding unique group.');
  }

  let newGroup = newGroups[0];
  group.members.map(async id => {
    await newGroup.addMembers(id);
  });

  model.Group.findOne({
    include: [{
      model: model.User,
      as: 'members',
      through: {},
    }],
    where: { id: newGroup.id },
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
