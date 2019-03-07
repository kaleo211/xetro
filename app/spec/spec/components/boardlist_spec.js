import React from 'react';
import thunk from 'redux-thunk';

import configureStore from 'redux-mock-store';
import { createShallow } from '@material-ui/core/test-utils';

import BoardList from '../../../components/BoardList';
import { ListItem } from '@material-ui/core';

describe("BoardList", () => {
  it("has a list of boards", () => {
    const mockStore = configureStore([thunk]);
    let store = mockStore({
      boards: {
        boards: [
          {
            id: 0,
            locked: false,
            finished: false,
            facilitator: { video: "fakeURL" },
            team: {name: "fakeTeam0"},
          },
          {
            id: 1,
            locked: false,
            finsihed: false,
            facilitator: {video: "fakeURL"},
            team: {name: "fakeTeam1"},
          },
        ]
      },
    });
    let shallow = createShallow();

    const wrapper = shallow(<BoardList store={store} />).dive().dive();

    expect(wrapper.find(ListItem).length).toEqual(2);
  });
});
