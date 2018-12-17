import { FETCH_TEAMS, SELECT_TEAM, ADD_MEMBER_TO_TEAM, POST_TEAM } from '../actions/types';

const initialState = {
  teams: [],
  members: [],
  team: null,
  memberIDs: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_TEAMS:
      return {
        ...state,
        teams: action.teams,
      };

    case POST_TEAM:
      return {
        ...state,
        team: action.team,
        teams: action.teams,
      };

    case SELECT_TEAM:
      return {
        ...state,
        team: action.team,
        members: action.members,
        memberIDs: action.memberIDs,
      }

    case ADD_MEMBER_TO_TEAM:
      return {
        ...state,
        members: action.members,
        memberIDs: action.memberIDs,
      }

    default:
      return state;
  }
}
