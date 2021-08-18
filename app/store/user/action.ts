import { Dispatch } from 'redux';

import { UserActionTypes } from '../types';
import Utils from '../../components/Utils';
import { AppThunk } from '../types';

export const getMe = (): AppThunk => async (dispatch:Dispatch) => {
  try {
    const me = await Utils.fetch('/users/me');
    if (me) {
      dispatch({
        type: UserActionTypes.SET_ME,
        me,
      });
    }
  } catch (err) {
    console.error('error getting me', err);
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
