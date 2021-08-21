import '@babel/polyfill';
import taskSvc from '../../services/task';

jest.mock('../models', () => ({Task: {create: jest.fn()}}));
import models from '../../models'; // import after mock

describe('Task', () => {
  describe('create', () => {
    it('should create an item with owner, group, board and item', async () => {
      // Preparation
      const fakeCreatedTask = {
        setOwner: jest.fn(),
        setGroup: jest.fn(),
        setBoard: jest.fn(),
        setItem: jest.fn(),
      };
      models.Task.create = jest.fn(async () => fakeCreatedTask);

      // Execution
      await taskSvc.create('fakeTitle', 'fakeOwnerID', 'fakeGroupTD', 'fakeboardID', 'fakeItemTD');

      // Assertion
      expect(models.Task.create).toHaveBeenCalledWith({title: 'fakeTitle'});
      expect(fakeCreatedTask.setOwner).toHaveBeenCalledWith('fakeOwnerID');
      expect(fakeCreatedTask.setGroup).toHaveBeenCalledWith('fakeGroupTD');
      expect(fakeCreatedTask.setBoard).toHaveBeenCalledWith('fakeboardID');
      expect(fakeCreatedTask.setItem).toHaveBeenCalledWith('fakeItemTD');
    });
  });
});
