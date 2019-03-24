import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import { JSDOM } from 'jsdom';

import * as actions from '../../../actions/pillarActions';

import { POST_PILLAR, SET_BOARD } from '../../../actions/types';

describe("pillarActions", () => {
  afterEach(() => {
    fetchMock.reset();
  });

  describe('when the board id is not presented', () => {
    it("", () => {
      const mockStore = configureStore([thunk]);
      const store = mockStore();

      const expectedActions = [{
        'pillar': {},
        'type': POST_PILLAR,
      }, {
        'type': SET_BOARD,
        'board': null,
      }];

      global.window = new JSDOM('', {
        url: 'http:test/'
      }).window;

      fetchMock.postOnce('http://test:8080/api/pillars', {});

      store.dispatch(actions.postPillar({}, null)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
