import {
  SET_USERS,
  SET_ME,
} from '../actions/types';

const initialState = {
  users: [],
  me: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USERS:
      return {
        ...state,
        users: action.users,
      };

    case SET_ME:
      return {
        ...state,
        me: action.me,
      }

    default:
      return state;
  }
}
