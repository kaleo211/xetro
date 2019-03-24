import {
  POST_ITEM,
  PATCH_ITEM,
  DELETE_ITEM,
  POST_ACTION,
  PATCH_ACTION
} from './types';
import Utils from '../components/Utils';
import { setBoard } from './boardActions';

export const patchItem = (i, updatedItem, bID) => {
  return (dispatch) => {
    Utils.patchResource(i, updatedItem).then(body => {
      let item = Utils.reform(body);
      dispatch({
        type: PATCH_ITEM,
        item,
      });
      dispatch(setBoard(bID));
    });
  };
};

export const deleteItem = (itemID) => {
  return (dispatch) => {
    Utils.delete("items/" + itemID).then(body => {
      dispatch({
        type: DELETE_ITEM,
      });
    });
  };
};

export const postAction = (updatedAction) => dispatch => {
  return (dispatch) => {
    Utils.postResource("actions", updatedAction).then(body => {
      let action = Utils.reform(body);
      dispatch({
        type: POST_ACTION,
        action,
      });
    });
  };
};

export const postItem = (updatedItem, bID) => {
  return (dispatch) => {
    Utils.post('items', updatedItem).then(body => {
      let item = Utils.reform(body);
      dispatch({
        type: POST_ITEM,
        item,
      });
      dispatch(setBoard(bID));
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
