import '@babel/polyfill';
import pillarSvc from './pillar';

jest.mock('../models', () => ({Pillar: {}}));
import models from '../models'; // import after mock

describe('Pillar', () => {
  describe('create', () => {
    it('should create a pillar without error', async () => {
      const fakeReturnedPillar = {setBoard: jest.fn(async () => {})};
      models.Pillar.create = jest.fn(async () => fakeReturnedPillar);

      const returnedPillar = await pillarSvc.create('fakeTitle', 'fakeBoardID', 'fakePosition');

      expect(models.Pillar.create).toHaveBeenCalledWith({title: 'fakeTitle', position: 'fakePosition'});
      expect(fakeReturnedPillar.setBoard).toHaveBeenCalledWith('fakeBoardID');
      expect(returnedPillar).toEqual(fakeReturnedPillar);
    });
  });
});
