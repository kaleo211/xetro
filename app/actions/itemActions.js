import Utils from '../components/Utils';
import { setBoard } from './boardActions';
import { setActiveItem } from './localActions';
import { getMe } from './userActions';

export const patchItem = (item) => {
  return (dispatch) => {
    Utils.patch('items', item).then(body => {
      dispatch(setBoard(item.boardId));
    });
  };
};

export const likeItem = (item) => {
  return (dispatch) => {
    Utils.fetch(`/items/${item.id}/like`).then(() => {
      dispatch(setBoard(item.boardId));
    });
  };
};

export const finishItem = (item) => {
  return (dispatch) => {
    Utils.fetch(`/items/${item.id}/finish`).then(() => {
      dispatch(getMe());
    });
  };
};

export const startItem = (item) => {
  return (dispatch) => {
    Utils.fetch(`/items/${item.id}/start`).then(body => {
      dispatch(setBoard(item.boardId));
      dispatch(setActiveItem(body));
    });
  };
};

export const deleteItem = (item) => {
  return (dispatch) => {
    Utils.delete("items", item.id);
    dispatch(setBoard(item.boardId));
  };
};

export const postItem = (item) => {
  return (dispatch) => {
    Utils.post('items', item).then(() => {
      dispatch(setBoard(item.boardId));
    });
  };
};
