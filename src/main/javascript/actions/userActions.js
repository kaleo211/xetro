import {
  FETCH_USERS,
} from './types';
import Utils from '../components/Utils';

export const fetchUsers = () => dispatch => {
  Utils.fetchResource("members", (body => {
    let users = body._embedded.members;
    dispatch({
      type: FETCH_USERS,
      users
    });
  }));
};
