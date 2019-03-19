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

module.exports = routes;
