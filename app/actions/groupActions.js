import {
  FETCH_GROUPS,
  SET_GROUP,
  POST_GROUP,
  SEARCH_GROUPS,
} from './types';
import { getMe } from './userActions';
import Utils from '../components/Utils';

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

export const setGroup = (groupID) => {
  return (dispatch) => {
    if (groupID) {
      Utils.get(`groups`, groupID).then(group => {
        console.log('setGroup:', group);
        dispatch({
          type: SET_GROUP,
          group,
        });
      });
    } else {
      dispatch({
        type: SET_GROUP,
        group: null,
      });
    }
  };
};

export const addUserToGroup = (groupID, userID) => {
  return (dispatch) => {
    console.log('addUserToGroup:', groupID, userID);
    let group = { id: groupID, userID: userID }
    Utils.patch('groups', group).then(body => {
      dispatch({
        type: SET_GROUP,
        group: body,
      })
    });
  };
};
