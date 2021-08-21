import { AnyAction, Dispatch } from 'redux';

import { AppThunk, UserTaskTypes } from '../types';
import { fetchReq, listReq } from '../../utils';

export const getMeRaw = async (): Promise<AnyAction> => {
  const me = await fetchReq('/users/me');
  if (!me) {
    return {
      type: UserTaskTypes.FAILED,
      error: 'error getting me',
    }
  }
  return {
    type: UserTaskTypes.SET_ME,
    me,
  };
}

export const getMe = (): AppThunk => {
  return async (dispatch: Dispatch) => {
    dispatch(await getMeRaw());
  }
};

export const fetchUsers = (): AppThunk => async (dispatch:Dispatch) => {
  const users = await listReq('users');
  if (users) {
    dispatch({
      type: UserTaskTypes.SET_USERS,
      users,
    });
  }
};
