import '@babel/polyfill';
import boardSvc from '../../services/board';

jest.mock('../models', () => ({
  Board: {
    findOrCreate: jest.fn(),
  },
  Group: 'group',
}));
import models from '../../models'; // import after mock
const fakePillarSvc = {create: jest.fn()}

describe('Board', () => {
  describe('create', () => {
    it('should create a board with facilitator, group and pillars', async () => {
      // Preparation
      const fakeCreatedBoard = {
        setFacilitator: jest.fn(),
        setGroup: jest.fn(),
      };
      models.Board.findOrCreate = jest.fn(async () => [fakeCreatedBoard, true]);

      // Execution
      await boardSvc.create('fakeName', 'fakeGroupTD', fakePillarSvc);

      // Assertion
      const expectedArguments = {
        where: { groupID: 'fakeGroupTD', stage: 'created' },
        defaults: { name: 'fakeName', stage: 'created' },
      };
      expect(models.Board.findOrCreate).toHaveBeenCalledWith(expectedArguments);
      expect(fakeCreatedBoard.setGroup).toHaveBeenCalledWith('fakeGroupTD');
      expect(fakePillarSvc.create).toHaveBeenCalledTimes(3);
    });
  });

  // WIP
  describe('findAll', () => {
    it('should findAll the boards with the given condition', async () => {
      // Preparation
      const fakeCreatedBoard = {
        setFacilitator: jest.fn(),
        setGroup: jest.fn(),
      };
      models.Board.findAll = jest.fn(async () => fakeCreatedBoard);
      const fakeWhereClause = 'this is a fake query';
      const result = {
        include: [{
          model: 'group',
          as: 'group',
        }],
        where: fakeWhereClause,
      };
      // Execution
      await boardSvc.findAll(fakeWhereClause);

      // Assertion
      expect(models.Board.findAll).toHaveBeenCalledWith(result);
      // expect(fakeCreatedBoard.setGroup).toHaveBeenCalledWith('fakeGroupTD');
      // expect(fakePillarSvc.create).toHaveBeenCalledTimes(3);
    });
  });
});
