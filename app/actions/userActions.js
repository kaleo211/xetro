import {
  SET_USERS,
  SET_ME,
} from './types';
import Utils from '../components/Utils';

export const getMe = () => async (dispatch) => {
  try {
    const me = await Utils.fetch('/users/me');
    if (me) {
      dispatch({
        type: SET_ME,
        me,
      });
    }
  } catch (err) {
    console.error('error getting me', err);
  }
};

export const fetchUsers = () => async (dispatch) => {
  const resp = await Utils.list('users');
  if (resp.ok) {
    const users = await resp.json();
    dispatch({
      type: SET_USERS,
      users,
    });
  }
};
