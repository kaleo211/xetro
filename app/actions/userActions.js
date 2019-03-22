import {
  FETCH_USERS,
  GET_ME,
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
          type: GET_ME,
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
        type: FETCH_USERS,
        users,
      });
    });
  };
};
