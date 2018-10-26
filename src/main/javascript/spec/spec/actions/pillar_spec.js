import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import { JSDOM } from 'jsdom';

import * as actions from '../../../actions/pillarActions';
import { POST_PILLAR } from '../../../actions/types';

describe("pillarActions", () => {
  it("postAction", () => {
    const mockStore = configureStore([thunk]);
    const store = mockStore();

    const expectedActions = [{
      'pillar': {},
      'type': POST_PILLAR,
    }];

    global.window = new JSDOM('', {
      url: 'http:test/'
    }).window;

    fetchMock.postOnce('http://test:8080/api/pillars', {});
    fetchMock.getOnce('http://test:8080/api/boards/1', {});

    store.dispatch(actions.postPillar({}, 1)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  })
})
