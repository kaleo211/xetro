const routes = require('express').Router();
const model = require('../models');

var respondWithPillar = async (res, id) => {
  try {
    const pillar = await model.Pillar.findOne({
      include: [{
        model: model.Board,
        as: 'board',
      }, {
        model: model.Item,
        as: 'items',
        order: [['createdAt', 'ASC']],
      }],
      where: { id: id },
    });
    if (pillar) {
      res.json(pillar);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log('error get pillar', err);
    res.sendStatus(500);
  };
}

routes.delete('/:id', async (req, res) => {
  try {
    await model.Pillar.destroy({
      where: { id: req.params.id },
    });
    res.sendStatus(204);
  } catch (err) {
    console.log('error delete pillar', err);
    res.sendStatus(500);
  };
});

routes.post('/', async (req, res) => {
  var pillar = req.body;

  try {
    const newPillar = await model.Pillar.create({
      title: pillar.title,
    });
    await newPillar.setBoard(pillar.boardId);

    await respondWithPillar(res, newPillar.id);
  } catch (err) {
    console.log('error post pillar:', err);
    res.sendStatus(500);
  };
});

routes.patch('/:id', async (req, res) => {
  try {
    await model.Pillar.update({
      title: req.body.title,
    }, {
        where: { id: req.params.id },
      });
    await respondWithPillar(res, req.params.id);
  } catch (err) {
    console.log('error patch pillar:', err);
    res.sendStatus(500);
  };
});

module.exports = routes;
