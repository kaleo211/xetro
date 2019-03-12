const routes = require('express').Router();
const model = require('../models');

routes.get('/', function (req, res) {
  model.Team.findAll().then(teams => {
    res.json(teams);
  });
});

module.exports = routes;
