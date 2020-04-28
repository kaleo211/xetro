import express from 'express';
import boardSvc from '../services/board.js';
import pillarSvc from '../services/pillar.js';

const routes = express.Router();


// Get
routes.get('/:id', async (req, res) => {
  await respondWithBoard(res, { id: req.params.id });
});

routes.get('/active/:groupID', async (req, res) => {
  await respondWithBoard(res, {
    groupID: req.params.groupID,
    stage: 'created',
  });
});

// Archive
routes.get('/:id/archive', async (req, res) => {
  await updateBoard(res, req.params.id, { stage: 'archived' });
});

// Lock
routes.get('/:id/lock', async (req, res) => {
  await updateBoard(res, req.params.id, {
    locked: true,
  });
});

// Unlock
routes.get('/:id/unlock', async (req, res) => {
  await updateBoard(res, req.params.id, { locked: false });
});

// List
routes.get('/group/:id', async (req, res) => {
  try {
    const boards = await boardSvc.findAll({
      groupID: req.params.id,
    });
    res.json(boards);
  } catch (err) {
    console.error('error list boards', err);
    res.sendStatus(500);
  }
});


// Create
routes.post('/', async (req, res) => {
  const board = req.body;
  try {
    const newBoard = await boardSvc.create(board.name, board.groupID, pillarSvc);
    await respondWithBoard(res, { id: newBoard.id });
  } catch (err) {
    console.error('error post board:', err);
    res.sendStatus(500);
  }
});


// Update
routes.patch('/:id', async (req, res) => {
  try {
    const board = await boardSvc.findOne({ id: req.params.id });
    await board.setFacilitator(req.body.facilitatorID);
    await respondWithBoard(res, { id: board.id });
  } catch (err) {
    console.error('error patch board:', err);
    res.sendStatus(500);
  }
});


const respondWithBoard = async (res, whereCl) => {
  try {
    const board = await boardSvc.findOne(whereCl);
    if (board) {
      res.json(board);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error('error get board', err);
    res.sendStatus(500);
  }
};

const updateBoard = async (res, id, fields) => {
  try {
    await boardSvc.update(id, fields);
    res.json({});
  } catch (err) {
    console.error('error update board', err);
    res.sendStatus(500);
  }
};


export default routes;
