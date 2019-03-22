import {
  FETCH_GROUPS,
  SET_GROUP,
  ADD_MEMBER_TO_GROUP,
  POST_GROUP,
  SEARCH_GROUPS,
} from '../actions/types';

const initialState = {
  groups: [],
  members: [],
  group: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_GROUPS:
      return {
        ...state,
        groups: action.groups,
      };

    case POST_GROUP:
      return {
        ...state,
        group: action.group,
        groups: action.groups,
      };

    case SET_GROUP:
      return {
        ...state,
        group: action.group,
        members: action.members,
      }

    case ADD_MEMBER_TO_GROUP:
      return {
        ...state,
        members: action.members,
      }

    case SEARCH_GROUPS:
      return {
        ...state,
        matchedGroup: action.matchedGroup,
      }

    default:
      return state;
  }
}
