import { SET_GROUPS, SET_GROUP } from './types';
import { getMe } from './userActions';
import { setPage } from './localActions';
import Utils from '../components/Utils';
import { fetchGroupActiveBoard, setBoard } from './boardActions';

export const fetchGroups = () => async (dispatch) => {
  const groups = await Utils.list('groups');
  if (groups) {
    dispatch({
      type: SET_GROUPS,
      groups,
    });
  } else {
    console.error('error fetching groups:', groups);
  }
};

export const postGroup = (newGroup) => async (dispatch) => {
  const resp = await Utils.post('groups', newGroup);
  if (resp) {
    const groups = await Utils.list('groups');
    if (groups) {
      dispatch({
        type: SET_GROUPS,
        groups,
      });
    } else {
      console.error('error fetching groups after posting group', groups);
    }

    const group = await Utils.get('groups', resp.id);
    if (group) {
      dispatch({
        type: SET_GROUP,
        group,
      });
    } else {
      console.error('error fetching group after posting group', group);
    }
    dispatch(getMe());
  }
};

export const setGroup = (groupId) => async (dispatch) => {
  if (groupId == null) {
    dispatch(setBoard(null));
    dispatch(setPage(''));
    dispatch({
      type: SET_GROUP,
      group: null,
    });
  } else {
    const group = await Utils.get('groups', groupId);
    if (group) {
      dispatch(fetchGroupActiveBoard(groupId));
      dispatch({
        type: SET_GROUP,
        group,
      });
      dispatch(setPage('group'));
    } else {
      console.error('error fetching group for setting group', group);
    }
  }
};

export const addUserToGroup = (groupId, userId) => async (dispatch) => {
  const group = { id: groupId, userId };
  const returnedGroup = await Utils.patch('groups', group);
  if (returnedGroup) {
    dispatch({
      type: SET_GROUP,
      group: returnedGroup,
    });
  } else {
    console.error('error patching groups for adding user', returnedGroup);
  }
};
