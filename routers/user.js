const routes = require('express').Router();
const model = require('../models');

routes.get('/', (req, res) => {
  model.User.findAll({
    attributes: ['firstName', 'id'],
  }).then(users => {
    res.json(users);
  });
});

module.exports = routes;
