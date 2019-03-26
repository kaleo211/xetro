import {
  POST_ACTION,
  PATCH_ACTION
} from './types';
import Utils from '../components/Utils';
import { setBoard } from './boardActions';

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
      dispatch(setBoard(item.boardId));
    });
  };
};

export const startItem = (item) => {
  return (dispatch) => {
    Utils.fetch(`/items/${item.id}/start`).then(() => {
      dispatch(setBoard(item.boardId));
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

export const patchAction = (path, updatedAction) => {
  return (dispatch) => {
    Utils.patch(path, updatedAction).then(body => {
      let action = Utils.reform(body);
      dispatch({
        type: PATCH_ACTION,
        action,
      });
    });
  };
};
