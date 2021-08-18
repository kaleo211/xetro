import { ApplicationState, AppThunk, GroupActionTypes } from '../types';
import { getMe } from '../user/action';
import { setPage } from '../local/action';
import Utils from '../../components/Utils';
import { fetchGroupActiveBoard, setBoard } from '../board/action';
import { keyable } from '../../../utils/tool';
import { Dispatch } from 'redux';

export const searchGroups = (query:keyable): AppThunk => {
  return async (dispatch:Dispatch): Promise<void> => {
    const groups = await Utils.post('groups/search', query || {});
    if (groups) {
      dispatch({
        type: GroupActionTypes.SET_GROUPS,
        groups,
      });
    } else {
      console.error('error fetching groups:', groups);
    }
  }
};

export const postGroup = (newGroup:keyable): AppThunk => {
  return async (dispatch:Dispatch): Promise<void> => {
    const resp: keyable = await Utils.post('groups', newGroup);
    if (resp) {
      const groups = await Utils.post('groups/search', {});
      if (groups) {
        dispatch({
          type: GroupActionTypes.SET_GROUPS,
          groups,
        });
      } else {
        console.error('error fetching groups after posting group', groups);
      }

      const group = await Utils.get('groups', resp.id);
      if (group) {
        dispatch({
          type: GroupActionTypes.SET_GROUP,
          group,
        });
      } else {
        console.error('error fetching group after posting group', group);
      }
      dispatch(getMe());
    }
  }
};

export const setGroup = (groupID:string): AppThunk => {
  return async (dispatch:Dispatch): Promise<void> => {
    if (groupID == null) {
      dispatch(setBoard(null));
      dispatch(setPage(''));
      dispatch({
        type: GroupActionTypes.SET_GROUP,
        group: null,
      });
      return;
    }

    const group = await Utils.get('groups', groupID);
    if (group) {
      dispatch(fetchGroupActiveBoard(groupID));
      dispatch({
        type: GroupActionTypes.SET_GROUP,
        group,
      });
    } else {
      console.error('error fetching group for setting group', group);
    }
  }
};

export const addUserToGroup = (userID: string, groupID: string): AppThunk => {
  return async (dispatch:Dispatch): Promise<void> => {
    const returnedGroup = await Utils.post('groups/member', { userID, groupID });
    if (returnedGroup) {
      dispatch({
        type: GroupActionTypes.SET_GROUP,
        group: returnedGroup,
      });
    } else {
      console.error('error patching groups for adding user', returnedGroup);
    }
  }
};

export const setFacilitator = (facilitatorID: string): AppThunk => {
  return async (dispatch:Dispatch, getState:()=>ApplicationState) => {
    const { group } = getState().group;
    const body = { facilitatorID, groupID: group.id }
    const returnedGroup = await Utils.post('groups/facilitator', body);
    if (returnedGroup) {
      dispatch({
        type: GroupActionTypes.SET_GROUP,
        group: returnedGroup
      });
    } else {
      console.error('error set facilitator', group);
    }
  }
};
