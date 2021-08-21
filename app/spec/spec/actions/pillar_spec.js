import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import { JSDOM } from 'jsdom';

import * as tasks from '../../../tasks/pillarTasks';

import { POST_PILLAR, SET_BOARD } from '../../../tasks/types';

describe("pillarTasks", () => {
  afterEach(() => {
    fetchMock.reset();
  });

  describe('when the board id is not presented', () => {
    it("", () => {
      const mockStore = configureStore([thunk]);
      const store = mockStore();

      const expectedTasks = [{
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

      store.dispatch(tasks.postPillar({}, null)).then(() => {
        expect(store.getTasks()).toEqual(expectedTasks);
      });
    });
  });
});
