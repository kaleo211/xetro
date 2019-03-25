import {
  SET_USERS,
  SET_ME,
} from './types';
import Utils from '../components/Utils';

export const getMe = () => {
  return (dispatch) => {
    fetch('/users/me')
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
      }).then(me => {
        console.log('getMe:', me);
        dispatch({
          type: SET_ME,
          me,
        });
      });
  };
};

export const fetchUsers = () => {
  return (dispatch) => {
    Utils.list('users').then(users => {
      console.log('fetchUsers:', users);
      dispatch({
        type: SET_USERS,
        users,
      });
    });
  };
};
