import * as express from 'express';
import { Service } from '../services';


export class BoardRouter {
  public router: express.Router;

  constructor(service: Service) {
    this.router = express.Router();


    this.router.get('/:id', async (req, res) => {
      await respondWithBoard(res, { id: req.params.id });
    });

    this.router.get('/active/:groupID', async (req, res) => {
      await respondWithBoard(res, {
        groupID: req.params.groupID,
        stage: 'created',
      });
    });

    // Archive
    this.router.get('/:id/archive', async (req, res) => {
      await updateBoard(res, req.params.id, { stage: 'archived' });
    });

    // Lock
    this.router.get('/:id/lock', async (req, res) => {
      await updateBoard(res, req.params.id, {
        locked: true,
      });
    });

    // Unlock
    this.router.get('/:id/unlock', async (req, res) => {
      await updateBoard(res, req.params.id, { locked: false });
    });

    // List
    this.router.get('/group/:id', async (req, res) => {
      try {
        const boards = await service.board.findAll({
          groupID: req.params.id,
        });
        res.json(boards);
      } catch (err) {
        console.error('error list boards', err);
        res.sendStatus(500);
      }
    });


    // Create
    this.router.post('/', async (req, res) => {
      const board = req.body;
      try {
        const newBoard = await service.board.create(board.name, board.groupID);
        await respondWithBoard(res, { id: newBoard.id });
      } catch (err) {
        console.error('error post board:', err);
        res.sendStatus(500);
      }
    });


    // Update
    this.router.patch('/:id', async (req, res) => {
      try {
        const board = await service.board.findOne({ id: req.params.id });
        await respondWithBoard(res, { id: board.id });
      } catch (err) {
        console.error('error patch board:', err);
        res.sendStatus(500);
      }
    });


    const respondWithBoard = async (res: express.Response, whereCl: object) => {
      try {
        const board = await service.board.findOne(whereCl);
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

    const updateBoard = async (res: express.Response, id: string, fields: object) => {
      try {
        await service.board.update(id, fields);
        res.json({});
      } catch (err) {
        console.error('error update board', err);
        res.sendStatus(500);
      }
    };
  }
}

