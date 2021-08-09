import '@babel/polyfill';
import pillarSvc from '../../services/pillar';

jest.mock('../models', () => ({Pillar: {}}));
import models from '../../models'; // import after mock

describe('Pillar', () => {
  describe('create', () => {
    it('should create a pillar without error', async () => {
      const fakeReturnedPillar = {setBoard: jest.fn(async () => {})};
      models.Pillar.create = jest.fn(async () => fakeReturnedPillar);

      const returnedPillar = await pillarSvc.create('fakeTitle', 'fakeboardID', 'fakePosition');

      expect(models.Pillar.create).toHaveBeenCalledWith({title: 'fakeTitle', position: 'fakePosition'});
      expect(fakeReturnedPillar.setBoard).toHaveBeenCalledWith('fakeboardID');
      expect(returnedPillar).toEqual(fakeReturnedPillar);
    });
  });
});
