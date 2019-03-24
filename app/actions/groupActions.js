import {
  FETCH_GROUPS,
  SET_GROUP,
  POST_GROUP,
  SEARCH_GROUPS,
} from './types';
import { getMe } from './userActions';
import Utils from '../components/Utils';
import { fetchGroupActiveBoards } from './boardActions';

export const getGroup = (name) => {
  return (dispatch) => {
    Utils.search('groups', { name: name }).then(groups => {
      dispatch({
        type: SEARCH_GROUPS,
        matchedGroups: groups,
      })
    });
  }
}

export const fetchGroups = () => {
  return (dispatch) => {
    Utils.list('groups').then(groups => {
      dispatch({
        type: FETCH_GROUPS,
        groups,
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
          type: POST_GROUP,
          groups,
          group,
        });
      });
    });
  };
};

export const setGroup = (groupId) => {
  return (dispatch) => {
    if (groupId === null) {
      this.props.setBoard(null);
      this.props.setPage('');
    }

    if (groupId) {
      Utils.get(`groups`, groupId).then(body => {
        dispatch({
          type: SET_GROUP,
          group: body,
        });
        dispatch(fetchGroupActiveBoards(groupId));
      });
    }
    dispatch({
      type: SET_GROUP,
      group: null,
    });
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
