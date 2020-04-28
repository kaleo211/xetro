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
      await boardSvc.create('fakeName', 'fakeGroupID', fakePillarSvc);

      // Assertion
      expect(models.Board.create).toHaveBeenCalledWith({name: 'fakeName', stage: 'created'});
      expect(fakeCreatedBoard.setGroup).toHaveBeenCalledWith('fakeGroupID');
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
      const fakeWhereCondn = 'this is a fake query';
      const result = 
      { 
        include: [{
          model: "group", 
          as: 'group'}],
        where: fakeWhereCondn,
      };
      // Execution
      await boardSvc.findAll(fakeWhereCondn);

      // Assertion
      expect(models.Board.findAll).toHaveBeenCalledWith(result);
      // expect(fakeCreatedBoard.setGroup).toHaveBeenCalledWith('fakeGroupID');
      // expect(fakePillarSvc.create).toHaveBeenCalledTimes(3);
    });
  });
});
