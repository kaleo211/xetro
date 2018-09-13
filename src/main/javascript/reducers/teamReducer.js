import { FETCH_TEAMS, SELECT_TEAM, ADD_MEMBER_TO_TEAM } from '../actions/types';

const initialState = {
  teams: [],
  members: [],
  team: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_TEAMS:
      return {
        ...state,
        teams: action.payload
      };

    case SELECT_TEAM:
      return {
        ...state,
        team: action.team,
        members: action.members
      }

    case ADD_MEMBER_TO_TEAM:
      return {
        ...state,
        members: action.members
      }

    default:
      return state;
  }
}
