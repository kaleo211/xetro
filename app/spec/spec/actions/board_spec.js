import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { SET_BOARDS } from '../../../tasks/types';
import fetchMock from 'fetch-mock';
import { JSDOM } from 'jsdom';

import * as tasks from '../../../tasks/boardTasks';

describe("setBoards", () => {
  afterEach(() => {
    fetchMock.reset();
  });

  it("fetch all boards", () => {
    const mockStore = configureStore([thunk]);
    const store = mockStore();
    let fakeBoards = [{ name: "fakeBoard", id: 0 }];

    const expectedTasks = [{
      'boards': fakeBoards,
      'type': SET_BOARDS,
    }];

    global.window = new JSDOM('', {
      url: 'http:test/'
    }).window;

    fetchMock.getOnce('http://test:8080/api/boards', { _embedded: { boards: fakeBoards } });

    store.dispatch(tasks.setBoards()).then(() => {
      expect(store.getTasks()).toEqual(expectedTasks);
    });
  });
});
