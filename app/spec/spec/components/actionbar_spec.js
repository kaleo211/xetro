import React from 'react';
import thunk from 'redux-thunk';

import configureStore from 'redux-mock-store';
import { createShallow } from '@material-ui/core/test-utils';

import ActionBar from '../../../components/ActionBar';
import * as actions from "../../../actions/boardActions";
import * as localActions from '../../../actions/localActions';

describe("ActionBar", () => {
  const mockStore = configureStore([thunk]);

  beforeEach(() => {
  })

  it("has a refresh button", () => {
    let store = mockStore({
      boards: {
        board: {
          id: 0,
          locked: false,
          finished: false,
          facilitator: { video: "fakeURL" },
        },
      },
      groups: {
        members: [{ userID: "fakeID" }],
        group: { name: "fakeGroup" },
      },
    });

    spyOn(actions, 'setBoard').withArgs(0).and.returnValue("fakeReturn");
    spyOn(store, 'dispatch');

    let shallow = createShallow();

    const wrapper = shallow(<ActionBar store={store} />).dive().dive();

    expect(wrapper.find('#refreshButton').length).toEqual(1);
    wrapper.find('#refreshButton').simulate('click');

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith("fakeReturn");
  });

  it("has a button for view history boards", () => {
    let store = mockStore({
      boards: {
        boards: [
          { id: 0, name: "fakeBoard0" },
          { id: 1, name: "fakeBoard1" },
        ],
      },
      groups: {
        members: [{ userID: "fakeID" }],
        group: { name: "fakeGroup" },
      },
    });

    spyOn(actions, 'fetchBoards').and.returnValue("fakeFetchBoardsReturn");
    spyOn(localActions, 'setPage').withArgs('boardList').and.returnValue("fakeShowPageReturn");
    spyOn(store, 'dispatch');

    let shallow = createShallow();
    const wrapper = shallow(<ActionBar store={store} />).dive().dive();

    expect(wrapper.find('#historyButton').length).toEqual(1);
    wrapper.find('#historyButton').simulate('click');

    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch).toHaveBeenCalledWith("fakeFetchBoardsReturn");
  });
});
