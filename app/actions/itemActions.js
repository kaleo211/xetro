import Utils from '../components/Utils';
import { setBoard } from './boardActions';
import { setActiveItem } from './localActions';
import { getMe } from './userActions';
import { setGroup } from './groupActions';

export const patchItem = (item) => async (dispatch) => {
  await Utils.patch('items', item);
  dispatch(setBoard(item.boardID));
};

export const likeItem = (item) => async (dispatch) => {
  await Utils.fetch(`/items/${item.id}/like`);
  dispatch(setBoard(item.boardID));
};

export const finishItem = (item) => async (dispatch, getState) => {
  const { board } = getState().boards;
  await Utils.fetch(`/items/${item.id}/finish`);
  dispatch(setBoard(board.id));
};

export const startItem = (item) => async (dispatch, getState) => {
  const { secondsPerItem } = getState().local;
  const now = new Date();
  now.setSeconds(now.getSeconds() + secondsPerItem);
  const activeItem = await Utils.post(`items/${item.id}/start`, {end: new Date(now)});
  if (activeItem) {
    dispatch(setBoard(item.boardID));
    dispatch(setActiveItem(activeItem));
  }
};

export const deleteItem = (item) => async (dispatch) => {
  await Utils.delete('items', item.id);
  dispatch(setBoard(item.boardID));
};

export const postItem = (item) => async (dispatch) => {
  await Utils.post('items', item);
  dispatch(setBoard(item.boardID));
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
  dispatch(setBoard(action.boardID));
  dispatch(setGroup(action.groupID));
};

export const postAction = (action) => async (dispatch) => {
  await Utils.post('actions', action);
  dispatch(setBoard(action.boardID));
  dispatch(setGroup(action.groupID));
};
