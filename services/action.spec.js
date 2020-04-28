import '@babel/polyfill';
import actionSvc from './action';

jest.mock('../models', () => ({Action: {create: jest.fn()}}));
import models from '../models'; // import after mock

describe('Action', () => {
  describe('create', () => {
    it('should create an item with owner, group, board and item', async () => {
      // Preparation
      const fakeCreatedAction = {
        setOwner: jest.fn(),
        setGroup: jest.fn(),
        setBoard: jest.fn(),
        setItem: jest.fn(),
      };
      models.Action.create = jest.fn(async () => fakeCreatedAction);

      // Execution
      await actionSvc.create('fakeTitle', 'fakeOwnerID', 'fakeGroupID', 'fakeBoardID', 'fakeItemID');

      // Assertion
      expect(models.Action.create).toHaveBeenCalledWith({title: 'fakeTitle'});
      expect(fakeCreatedAction.setOwner).toHaveBeenCalledWith('fakeOwnerID');
      expect(fakeCreatedAction.setGroup).toHaveBeenCalledWith('fakeGroupID');
      expect(fakeCreatedAction.setBoard).toHaveBeenCalledWith('fakeBoardID');
      expect(fakeCreatedAction.setItem).toHaveBeenCalledWith('fakeItemID');
    });
  });
});
