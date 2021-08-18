import { GroupActionTypes, GroupStateI } from '../types';
import { Reducer } from "redux";

const initialState: GroupStateI = {
  groups: [],
  group: null,
};

const reducer: Reducer<GroupStateI> = (state = initialState, action) => {
  switch (action.type) {
    case GroupActionTypes.SET_GROUPS:
      return {
        ...state,
        groups: action.groups,
      };

    case GroupActionTypes.SET_GROUP:
      return {
        ...state,
        group: action.group,
      }

    default:
      return state;
  }
}

export { reducer as GroupReducer };
