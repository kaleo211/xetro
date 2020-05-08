import Utils from '../components/Utils';
import { refreshBoard } from './boardActions';
import { setActiveItem } from './localActions';
import { getMe } from './userActions';
import { setGroup } from './groupActions';

export const patchItem = (item) => async (dispatch) => {
  await Utils.patch('items', item);
  dispatch(refreshBoard());
};

export const likeItem = (item) => async (dispatch) => {
  await Utils.fetch(`/items/${item.id}/like`);
  dispatch(refreshBoard());
};

export const finishItem = (item) => async (dispatch, getState) => {
  const { board } = getState().boards;
  await Utils.fetch(`/items/${item.id}/finish`);
  dispatch(refreshBoard());
};

export const startItem = (item) => async (dispatch, getState) => {
  const { secondsPerItem } = getState().local;
  const now = new Date();
  now.setSeconds(now.getSeconds() + secondsPerItem);
  const activeItem = await Utils.post(`items/${item.id}/start`, {end: new Date(now)});
  if (activeItem) {
    dispatch(refreshBoard());
    dispatch(setActiveItem(activeItem));
  }
};

export const deleteItem = (item) => async (dispatch) => {
  await Utils.delete('items', item.id);
  dispatch(refreshBoard());
};

export const postItem = (item) => async (dispatch) => {
  await Utils.post('items', item);
  dispatch(refreshBoard());
};

export const finishAction = (action) => async (dispatch) => {
  await Utils.fetch(`/actions/${action.id}/finish`);
  dispatch(getMe());
  dispatch(setGroup(action.groupID));
};

export const deleteAction = (action) => async (dispatch) => {
  await Utils.delete('actions', action.id);
  dispatch(setGroup(action.groupID));
};

export const startAction = (action) => async (dispatch) => {
  await Utils.fetch(`/action/${action.id}/start`);
  dispatch(refreshBoard());
  dispatch(setGroup(action.groupID));
};

export const postAction = (action) => async (dispatch) => {
  await Utils.post('actions', action);
  dispatch(refreshBoard());
  dispatch(setGroup(action.groupID));
};
