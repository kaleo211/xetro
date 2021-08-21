import { AnyAction, Dispatch } from 'redux';

import { AppThunk, UserActionTypes } from '../types';
import Utils from '../../utils';

export const getMeRaw = async (): Promise<AnyAction> => {
  const me = await Utils.fetch('/users/me');
  if (!me) {
    return {
      type: UserActionTypes.FAILED,
      error: 'error getting me',
    }
  }
  return {
    type: UserActionTypes.SET_ME,
    me,
  };
}

export const getMe = (): AppThunk => {
  return async (dispatch: Dispatch) => {
    dispatch(await getMeRaw());
  }
};

export const fetchUsers = (): AppThunk => async (dispatch:Dispatch) => {
  const users = await Utils.list('users');
  if (users) {
    dispatch({
      type: UserActionTypes.SET_USERS,
      users,
    });
  }
};
