import {
  FETCH_USERS,
} from '../actions/types';

const initialState = {
  users: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_USERS:
      return {
        ...state,
        users: action.users
      };

    default:
      return state;
  }
}
