import {
  FETCH_USERS,
  POST_USER,
} from './types';
import Utils from '../components/Utils';

export const fetchUsers = () => {
  return (dispatch) => {
    Utils.fetchResource("members").then(body => {
      let users = body._embedded.members;
      dispatch({
        type: FETCH_USERS,
        users
      });
    });
  };
};

export const postUser = (user) => {
  return (dispatch) => {
    Utils.postResource("members", user).then(body => {
      let user = Utils.reform(body);
      dispatch({
        type: POST_USER,
        user,
      });

      Utils.fetchResource("members").then(body => {
        let users = body._embedded.members;
        dispatch({
          type: FETCH_USERS,
          users
        });
      });
    });
  };
}
