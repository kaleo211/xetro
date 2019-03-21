import {
  FETCH_USERS,
  GET_ME,
} from './types';
import Utils from '../components/Utils';


export const getMe = () => {
  return (dispatch) => {
    Utils.get('me').then(me => {
      console.log('getMe:', me);
      dispatch({
        type: GET_ME,
        me,
      });
    });

  };
}

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
