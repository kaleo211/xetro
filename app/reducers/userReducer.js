import {
  FETCH_USERS,
  GET_ME,
} from '../actions/types';

const initialState = {
  users: [],
  me: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_USERS:
      return {
        ...state,
        users: action.users,
      };

    case GET_ME:
      return {
        ...state,
        me: action.me,
      }

    default:
      return state;
  }
}
