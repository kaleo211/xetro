const routes = require('express').Router();
const model = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var respondWithGroup = async (res, id) => {
  try {
    const group = await model.Group.findOne({
      include: [{
        model: model.User,
        as: 'members',
      }, {
        model: model.Board,
        as: 'boards',
      }],
      where: { id: id },
    });
    if (group) {
      res.json(group);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log('error get group', err);
    res.sendStatus(500);
  };
}

routes.get('/:id', async (req, res) => {
  respondWithGroup(res, req.params.id);
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
        as: 'members',
        through: {},
      }],
    });
    res.json(groups);
  } catch (err) {
    console.log('error delete group', err);
    res.sendStatus(500);
  };
});

routes.post('/search', async (req, res) => {
  console.log('req:', req.body);
  var name = req.body.name;

  model.Group.findAll({
    include: [{
      model: model.User,
      as: 'members',
      through: {},
    }],
    where: {
      name: { [Op.iLike]: `%${name}%` },
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

  try {
    const newGroups = await model.Group.findOrCreate({
      where: { name: group.name },
    });
    if (newGroups.length != 2) {
      console.log('error finding unique group:');
      res.sendStatus(500);
      return;
    }

    let newGroup = newGroups[0];
    group.members.map(async id => {
      await newGroup.addMembers(id);
    });
    await respondWithGroup(res, newGroup.id);

  } catch (err) {
    console.log('error post group:', err);
    res.sendStatus(500);
  };
});

routes.patch('/:id', async (req, res) => {
  try {
    const group = await model.Group.findOne({
      where: { id: req.params.id },
    });
    await group.addMembers(req.body.userID)
    await respondWithGroup(res, group.id);
  } catch (err) {
    console.log('error patch group:', err);
    res.sendStatus(500);
  };
});

module.exports = routes;
