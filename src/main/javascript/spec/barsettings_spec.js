import React from 'react';
import thunk from 'redux-thunk';

import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import BarSettings from '../components/BarSettings';
import * as actions from "../actions/boardActions";

describe("BarSettings", () => {
  it("contains spec with an expectation", () => {
    const mockStore = configureStore([thunk]);
    let store = mockStore({
      boards: {
        board: {
          id: 0,
          locked: false,
          finished: false,
          facilitator: { video: "fakeURL" },
        },
      },
      teams: {
        members: [{ userID: "fakeID" }],
        team: { name: "fakeTeam" },
      },
    });

    spyOn(actions, 'selectBoard').withArgs(0).and.returnValue("fakeReturn");
    spyOn(store, 'dispatch');

    const wrapper = shallow(<BarSettings store={store} />).dive();

    expect(wrapper.find('#refreshButton').length).toEqual(1);
    wrapper.find('#refreshButton').simulate('click');

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith("fakeReturn");
  });
});
