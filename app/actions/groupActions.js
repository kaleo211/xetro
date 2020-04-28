import { SET_GROUPS, SET_GROUP } from './types';
import { getMe } from './userActions';
import { setPage } from './localActions';
import Utils from '../components/Utils';
import { fetchGroupActiveBoard, setBoard } from './boardActions';

export const searchGroups = (query) => async (dispatch) => {
  const groups = await Utils.post('groups/search', query || {});
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
    const groups = await Utils.post('groups/search', {});
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

export const setGroup = (groupID) => async (dispatch) => {
  if (groupID == null) {
    dispatch(setBoard(null));
    dispatch(setPage(''));
    dispatch({
      type: SET_GROUP,
      group: null,
    });
    return;
  }

  const group = await Utils.get('groups', groupID);
  if (group) {
    dispatch(fetchGroupActiveBoard(groupID));
    dispatch({
      type: SET_GROUP,
      group,
    });
  } else {
    console.error('error fetching group for setting group', group);
  }
};

export const addUserToGroup = (userID, groupID) => async (dispatch) => {
  const returnedGroup = await Utils.post('groups/member', { userID, groupID });
  if (returnedGroup) {
    dispatch({
      type: SET_GROUP,
      group: returnedGroup,
    });
  } else {
    console.error('error patching groups for adding user', returnedGroup);
  }
};

export const setFacilitator = (facilitatorID) => async (dispatch, getState) => {
  const { group } = getState().groups;
  const body = { facilitatorID, groupID: group.id }
  const returnedGroup = await Utils.post('groups/facilitator', body);
  if (returnedGroup) {
    dispatch({
      type: SET_GROUP,
      group: returnedGroup
    });
  } else {
    console.error('error set facilitator', group);
  }
};
