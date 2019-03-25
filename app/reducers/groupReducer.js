import {
  SET_GROUPS,
  SET_GROUP,
} from '../actions/types';

const initialState = {
  groups: [],
  group: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_GROUPS:
      return {
        ...state,
        groups: action.groups,
      };

    case SET_GROUP:
      return {
        ...state,
        group: action.group,
      }

    default:
      return state;
  }
}
