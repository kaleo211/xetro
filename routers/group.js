const routes = require('express').Router();
const { Op } = require('sequelize');
const model = require('../models');

const { search } = require('../services/group');

const respondWithGroup = async (res, id) => {
  try {
    const group = await model.Group.findOne({
      include: [
        {
          model: model.User,
          as: 'members',
          include: [{
            model: model.Action,
            as: 'actions',
            where: {
              stage: {
                [Op.ne]: 'done',
              },
            },
            required: false,
          }],
        },
        {
          model: model.Board,
          as: 'boards',
        },
        {
          model: model.Action,
          as: 'actions',
          required: false,
          include: [{
            model: model.User,
            as: 'owner',
          }],
        },
      ],
      where: { id },
    });
    if (group) {
      res.json(group);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error('error get group', err);
    res.sendStatus(500);
  }
};

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
    console.error('error delete group', err);
    res.sendStatus(500);
  }
});

routes.post('/search', async (req, res) => {
  const { name } = req.body;
  try {
    const groups = await search({ name });
    res.json(groups);
  } catch (err) {
    console.error('error search group:', err);
    res.sendStatus(500);
  }
});

routes.post('/', async (req, res) => {
  const group = req.body;

  try {
    const newGroups = await model.Group.findOrCreate({
      where: { name: group.name },
    });
    if (newGroups.length != 2) {
      console.error('error finding unique group:');
      res.sendStatus(500);
      return;
    }
    const newGroup = newGroups[0];
    group.members.map(async id => {
      await newGroup.addMembers(id);
    });
    await respondWithGroup(res, newGroup.id);
  } catch (err) {
    console.error('error post group:', err);
    res.sendStatus(500);
  }
});

routes.post('/member', async (req, res) => {
  try {
    const { userID, groupID } = req.body;
    const group = await model.Group.findOne({
      where: { id: groupID },
    });
    if (group) {
      await group.addMembers(userID);
      await respondWithGroup(res, groupID);
    } else {
      res.sendStatus(500);
    }
  } catch (err) {
    console.error('error patch group:', err);
    res.sendStatus(500);
  }
});

module.exports = routes;
