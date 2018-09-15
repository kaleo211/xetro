import {
  FETCH_USERS,
  POST_USER,
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

export const postUser = (user) => dispatch => {
  return new Promise((resolve, reject) => {
    Utils.postResource("members", user, ((body) => {
      let user = Utils.reform(body);
      dispatch({
        type: POST_USER,
        user,
      });
      resolve();
    }));
  });
}
