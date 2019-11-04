const routes = require('express').Router();
const Sequelize = require('sequelize');
const model = require('../models');

const Op = Sequelize.Op;

routes.get('/', async (req, res) => {
  try {
    const users = await model.User.findAll({
      include: [{
        model: model.Group,
        as: 'groups',
        through: {},
      }],
    });
    res.json(users);
  } catch (err) {
    console.error('error find group users:', err);
    res.sendStatus(500);
  }
});

routes.get('/me', (req, res) => {
  const me = req.session.me;

  model.User.findOne({
    include: [{
      model: model.Group,
      as: 'groups',
      through: {},
    }, {
      model: model.Action,
      as: 'actions',
      where: {
        stage: {
          [Op.ne]: 'done',
        },
      },
      required: false,
    }],
    where: { id: me.id },
  }).then(user => {
    res.json(user);
  }).catch(err => {
    console.error('error get me:', err);
    res.sendStatus(500);
  });
});

module.exports = routes;
