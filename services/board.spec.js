import '@babel/polyfill';
import boardSvc from './board';

jest.mock('../models', () => ({Board: {create: jest.fn()}}));
import models from '../models'; // import after mock
const fakePillarSvc = {create: jest.fn()}

describe('Board', () => {
  describe('create', () => {
    it('should create a board with facilitator, group and pillars', async () => {
      // Preparation
      const fakeCreatedBoard = {
        setFacilitator: jest.fn(),
        setGroup: jest.fn(),
      };
      models.Board.create = jest.fn(async () => fakeCreatedBoard);

      // Execution
      await boardSvc.create('fakeName', 'fakeFacilitatorID', 'fakeGroupID', fakePillarSvc);

      // Assertion
      expect(models.Board.create).toHaveBeenCalledWith({name: 'fakeName', stage: 'created'});
      expect(fakeCreatedBoard.setFacilitator).toHaveBeenCalledWith('fakeFacilitatorID');
      expect(fakeCreatedBoard.setGroup).toHaveBeenCalledWith('fakeGroupID');
      expect(fakePillarSvc.create).toHaveBeenCalledTimes(3);
    });
  });
});
