import {
  SET_GROUPS,
  SET_GROUP,
} from './types';
import { getMe } from './userActions';
import { setPage } from './localActions';
import Utils from '../components/Utils';
import { fetchGroupActiveBoard } from './boardActions';

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
  return async (dispatch) => {
    const resp = await Utils.post('groups', newGroup);
    if (resp) {
      const groups = await Utils.list('groups');
      dispatch({
        type: SET_GROUPS,
        groups,
      });

      const group = await Utils.get('groups', resp.id);
      dispatch({
        type: SET_GROUP,
        group,
      });

      dispatch(getMe());
    }
  };
};

export const setGroup = (groupId) => {
  return async (dispatch) => {
    if (groupId == null) {
      dispatch(setBoard(null));
      dispacth(setPage(''));
      dispatch({
        type: SET_GROUP,
        group: null,
      });
    } else {
      const group = await Utils.get(`groups`, groupId);
      if (group) {
        dispatch(fetchGroupActiveBoard(groupId));
        dispatch({
          type: SET_GROUP,
          group,
        });
        dispatch(setPage('group'));
      }
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
