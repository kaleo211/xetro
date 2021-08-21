import { Reducer } from "redux";

import { UserTaskTypes, UserStateI } from '../types';

const initialState: UserStateI = {
  users: [],
  me: null,
};

const reducer: Reducer<UserStateI> = (state = initialState, task) => {
  switch (task.type) {
    case UserTaskTypes.SET_USERS:
      return {
        ...state,
        users: task.users,
      };

    case UserTaskTypes.SET_ME:
      return {
        ...state,
        me: task.me,
      }

    default:
      return state;
  }
}

export { reducer as UserReducer };
