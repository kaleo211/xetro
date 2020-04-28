import '@babel/polyfill';
import itemSvc from './item';

jest.mock('../models', () => ({Item: {create: jest.fn()}}));
import models from '../models'; // import after mock

describe('Item', () => {
  describe('create', () => {
    it('should create an item with owner, group, board and pillar', async () => {
      // Preparation
      const fakeCreatedItem = {
        setOwner: jest.fn(),
        setGroup: jest.fn(),
        setPillar: jest.fn(),
      };
      models.Item.create = jest.fn(async () => fakeCreatedItem);

      // Execution
      const returnedItem = await itemSvc.create('fakeTitle', 'fakeOwnerID', 'fakeGroupID', 'fakePillarID');

      // Assertion
      expect(returnedItem).toEqual(fakeCreatedItem);
      expect(models.Item.create).toHaveBeenCalledWith({title: 'fakeTitle'});
      expect(fakeCreatedItem.setOwner).toHaveBeenCalledWith('fakeOwnerID');
      expect(fakeCreatedItem.setGroup).toHaveBeenCalledWith('fakeGroupID');
      expect(fakeCreatedItem.setPillar).toHaveBeenCalledWith('fakePillarID');
    });
  });
});
