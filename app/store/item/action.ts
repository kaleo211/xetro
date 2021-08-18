import Utils from '../../components/Utils';
import { refreshBoard } from '../board/action';
import { setActiveItem } from '../local/action';
import { getMe } from '../user/action';
import { setGroup } from '../group/action';
import { ActionI, ItemI } from '../../../types/models';
import { Dispatch } from 'redux';
import { ApplicationState, AppThunk } from '../types';

export const patchItem = (item:ItemI): AppThunk => async (dispatch:Dispatch) => {
  await Utils.patch('items', item);
  dispatch(refreshBoard());
};

export const likeItem = (item:ItemI): AppThunk => async (dispatch:Dispatch) => {
  await Utils.fetch(`/items/${item.id}/like`);
  dispatch(refreshBoard());
};

export const finishItem = (item:ItemI): AppThunk => async (dispatch:Dispatch) => {
  await Utils.fetch(`/items/${item.id}/finish`);
  dispatch(refreshBoard());
};

export const startItem = (item:ItemI): AppThunk => async (dispatch:Dispatch, getState:()=>ApplicationState) => {
  const { secondsPerItem } = getState().local;
  const now = new Date();
  now.setSeconds(now.getSeconds() + secondsPerItem);
  const activeItem = await Utils.post(`items/${item.id}/start`, {end: new Date(now)});
  if (activeItem) {
    dispatch(refreshBoard());
    dispatch(setActiveItem(activeItem as ItemI));
  }
};

export const deleteItem = (item:ItemI): AppThunk => async (dispatch:Dispatch) => {
  await Utils.delete('items', item.id);
  dispatch(refreshBoard());
};

export const postItem = (item:ItemI): AppThunk => async (dispatch:Dispatch) => {
  await Utils.post('items', item);
  dispatch(refreshBoard());
};

export const finishAction = (action:ActionI): AppThunk => async (dispatch:Dispatch) => {
  await Utils.fetch(`/actions/${action.id}/finish`);
  dispatch(getMe());
  dispatch(setGroup(action.groupID));
};

export const deleteAction = (action: ActionI): AppThunk => async (dispatch:Dispatch) => {
  await Utils.delete('actions', action.id);
  dispatch(setGroup(action.groupID));
};

export const startAction = (action:ActionI): AppThunk => async (dispatch:Dispatch) => {
  await Utils.fetch(`/action/${action.id}/start`);
  dispatch(refreshBoard());
  dispatch(setGroup(action.groupID));
};

export const postAction = (action:ActionI): AppThunk => async (dispatch:Dispatch) => {
  await Utils.post('actions', action);
  dispatch(refreshBoard());
  dispatch(setGroup(action.groupID));
};
