import {
  FETCH_USERS,
} from './types';
import Utils from '../components/Utils';

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
