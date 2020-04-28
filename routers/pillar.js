import express from 'express';
import pillarSvc from '../services/pillar.js';

const routes = express.Router();


routes.delete('/:id', async (req, res) => {
  try {
    await pillarSvc.remove(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    console.error('error delete pillar', err);
    res.sendStatus(500);
  }
});

routes.post('/', async (req, res) => {
  const pillar = req.body;
  try {
    const newPillar = await pillarSvc.create(pillar.title, pillar.boardID);
    await respondWithPillar(res, newPillar.id);
  } catch (err) {
    console.error('error post pillar:', err);
    res.sendStatus(500);
  }
});

routes.patch('/:id', async (req, res) => {
  try {
    await pillar.updateTitle(req.params.id, req.body.title);
    await respondWithPillar(res, req.params.id);
  } catch (err) {
    console.error('error patch pillar:', err);
    res.sendStatus(500);
  }
});


const respondWithPillar = async (res, id) => {
  try {
    const pillar = await pillarSvc.findOne({id});
    if (pillar) {
      res.json(pillar);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error('error get pillar', err);
    res.sendStatus(500);
  }
};


export default routes;
