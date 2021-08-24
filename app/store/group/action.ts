import { AnyAction, Dispatch } from 'redux';

import { ApplicationState, AppThunk, GroupTaskTypes } from '../types';
import { getMeRaw } from '../user/action';
import { Keyable } from '../../../types/common';
import { getReq, postReq } from '../../utils';

export const searchGroups = (query:Keyable): AppThunk => {
  return async (dispatch:Dispatch): Promise<void> => {
    const groups = await postReq('groups/search', query || {});
    if (groups) {
      dispatch({
        type: GroupTaskTypes.SET_GROUPS,
        groups,
      });
    } else {
      console.error('error fetching groups:');
    }
  }
};

export const postGroup = (newGroup:Keyable): AppThunk => {
  return async (dispatch:Dispatch): Promise<void> => {
    const resp: Keyable = await postReq('groups', newGroup);
    if (resp) {
      const groups = await postReq('groups/search', {});
      if (groups) {
        dispatch({
          type: GroupTaskTypes.SET_GROUPS,
          groups,
        });
      } else {
        console.error('error fetching groups after posting group', groups);
      }

      const group = await getReq('groups', resp.id);
      if (group) {
        dispatch({
          type: GroupTaskTypes.SET_GROUP,
          group,
        });
      } else {
        console.error('error fetching group after posting group', group);
      }
      dispatch(await getMeRaw());
    }
  }
};

export const setGroupRaw = async (groupID: string): Promise<AnyAction> => {
  if (groupID == null) {
    return {
      type: GroupTaskTypes.SET_GROUP,
      group: null,
    };
  }

  const group = await getReq('groups', groupID);
  if (group) {
    // await fetchGroupActiveBoardRaw(groupID);
    return {
      type: GroupTaskTypes.SET_GROUP,
      group,
    };
  }

  return {
    type: GroupTaskTypes.FAILED,
    error: 'error fetching group for setting group',
  }
}

export const setGroup = (groupID:string): AppThunk => {
  return async (dispatch:Dispatch): Promise<void> => {
    dispatch(await setGroupRaw(groupID));
  }
};

export const addUserToGroup = (userID: string, groupID: string): AppThunk => {
  return async (dispatch:Dispatch): Promise<void> => {
    const returnedGroup = await postReq('groups/member', { userID, groupID });
    if (returnedGroup) {
      dispatch({
        type: GroupTaskTypes.SET_GROUP,
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
    const returnedGroup = await postReq('groups/facilitator', body);
    if (returnedGroup) {
      dispatch({
        type: GroupTaskTypes.SET_GROUP,
        group: returnedGroup
      });
    } else {
      console.error('error set facilitator', group);
    }
  }
};
