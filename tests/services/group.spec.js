import '@babel/polyfill';
import groupSvc from '../../services/group';

jest.mock('../models', () => ({
  User: {},
  Group: {},
}));
import models from '../../models'; // import after mock

describe('Group', () => {
  describe('setFacilitator', () => {
    it('should set facilitator for given board', async () => {
      // Preparation
      const fakeReturnedGroup = {setFacilitator: jest.fn()};
      models.Group.findOne = jest.fn(async () => fakeReturnedGroup);
      models.User.findOne = jest.fn(async () => ({name: 'fakeName'}));

      // Execution
      await groupSvc.setFacilitator('fakeGroupTD', 'fakeUserTD');

      // Assertion
      expect(models.Group.findOne).toHaveBeenCalledWith({where: {id: 'fakeGroupTD'}});
      expect(models.User.findOne).toHaveBeenCalledWith({where: {id: 'fakeUserTD'}});
      expect(fakeReturnedGroup.setFacilitator).toHaveBeenCalledWith({name: 'fakeName'});
    });
  });
});
