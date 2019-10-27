import Utils from '../components/Utils';
import { setBoard } from './boardActions';
import { setActiveItem } from './localActions';
import { getMe } from './userActions';

export const patchItem = (item) => async (dispatch) => {
  await Utils.patch('items', item);
  dispatch(setBoard(item.boardID));
};

export const likeItem = (item) => async (dispatch) => {
  await Utils.fetch(`/items/${item.id}/like`);
  dispatch(setBoard(item.boardID));
};

export const finishItem = (item) => async (dispatch) => {
  await Utils.fetch(`/items/${item.id}/finish`);
  dispatch(getMe());
  dispatch(setBoard(item.boardID));
};

export const startItem = (item) => async (dispatch) => {
  const activeItem = await Utils.fetch(`/items/${item.id}/start`);
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
