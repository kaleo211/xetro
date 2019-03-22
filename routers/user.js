const routes = require('express').Router();
const model = require('../models');

routes.get('/', (req, res) => {
  model.User.findAll({
    include: [{
      model: model.Group,
      as: 'groups',
      through: {},
    }],
  }).then(users => {
    res.json(users);
  });
});

routes.get('/me', (req, res) => {
  let me = req.session.user;

  model.User.findOne({
    include: [{
      model: model.Group,
      as: 'groups',
      through: {},
    }],
    where: { id: me.id },
  }).then(user => {
    res.json(user);
  }).catch(err => {
    console.log('error get me:', err);
    res.sendStatus(500);
  });
});

module.exports = routes;
