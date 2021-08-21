import { UserActionTypes, UserStateI } from '../types';
import { Reducer } from "redux";

const initialState: UserStateI = {
  users: [],
  me: null,
};

const reducer: Reducer<UserStateI> = (state = initialState, action) => {
  switch (action.type) {
    case UserActionTypes.SET_USERS:
      return {
        ...state,
        users: action.users,
      };

    case UserActionTypes.SET_ME:
      console.log("reducer:", action);
      return {
        ...state,
        me: action.me,
      }

    default:
      return state;
  }
}

export { reducer as UserReducer };
