import {
  FETCH_USERS,
  POST_USER,
} from '../actions/types';

const initialState = {
  users: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_USERS:
    case POST_USER:
      return {
        ...state,
        users: action.users
      };

    default:
      return state;
  }
}
