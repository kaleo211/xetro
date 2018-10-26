import {
  FETCH_USERS,
  POST_USER,
} from './types';
import Utils from '../components/Utils';

export const fetchUsers = () => {
  return new Promise((resolve, reject) => {
    Utils.fetchResource("members").then(body => {
      let users = body._embedded.members;
      resolve({
        type: FETCH_USERS,
        users
      });
    });
  });
};

export const postUser = (user) => {
  return new Promise((resolve, reject) => {
    Utils.postResource("members", user).then(body => {
      let user = Utils.reform(body);
      resolve({
        type: POST_USER,
        user,
      });
    });
  });
}
