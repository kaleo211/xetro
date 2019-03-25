import {
  SET_GROUPS,
  SET_GROUP,
} from './types';
import { getMe } from './userActions';
import Utils from '../components/Utils';
import { fetchGroupActiveBoards } from './boardActions';

export const fetchGroups = () => {
  return (dispatch) => {
    Utils.list('groups').then(body => {
      dispatch({
        type: SET_GROUPS,
        groups: body,
      });
    });
  };
};

export const postGroup = (newGroup) => {
  return (dispatch) => {
    Utils.post('groups', newGroup).then(group => {
      Utils.list('groups').then(groups => {
        dispatch(getMe());
        dispatch({
          type: SET_GROUPS,
          groups,
        });
        dispatch({
          type: SET_GROUP,
          group,
        });
      });
    });
  };
};

export const setGroup = (groupId) => {
  return (dispatch) => {
    if (groupId == null) {
      dispatch(setBoard(null));
      dispacth(setPage(''));
      dispatch({
        type: SET_GROUP,
        group: null,
      });
    } else {
      Utils.get(`groups`, groupId).then(body => {
        dispatch(fetchGroupActiveBoards(groupId));
        dispatch({
          type: SET_GROUP,
          group: body,
        });
      });
    }
  };
};

export const addUserToGroup = (groupId, userId) => {
  return (dispatch) => {
    let group = { id: groupId, userId: userId }
    Utils.patch('groups', group).then(body => {
      dispatch({
        type: SET_GROUP,
        group: body,
      })
    });
  };
};
