import '@babel/polyfill';
import userSvc from './user';

jest.mock('../models', () => ({User: {create: jest.fn()}}));
import models from '../models'; // import after mock

describe('User', () => {
  describe('create', () => {
    it('should create a user with required fields', async () => {
      await userSvc.create('fakeEmail', 'fakeFirstName', 'fakeLastName', 'fakeMicrosoftID');
      expect(models.User.create).toHaveBeenCalledWith({
        email: 'fakeEmail', firstName: 'fakeFirstName', lastName: 'fakeLastName', microsoftID: 'fakeMicrosoftID'
      });
    });
  });
});
