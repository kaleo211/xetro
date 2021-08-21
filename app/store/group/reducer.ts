import { Reducer } from "redux";

import { GroupTaskTypes, GroupStateI } from '../types';

const initialState: GroupStateI = {
  groups: [],
  group: null,
};

const reducer: Reducer<GroupStateI> = (state = initialState, task) => {
  switch (task.type) {
    case GroupTaskTypes.SET_GROUPS:
      return {
        ...state,
        groups: task.groups,
      };

    case GroupTaskTypes.SET_GROUP:
      return {
        ...state,
        group: task.group,
      }

    default:
      return state;
  }
}

export { reducer as GroupReducer };
