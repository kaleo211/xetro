import {
  POST_ITEM,
  PATCH_ITEM,
  DELETE_ITEM,
  POST_ACTION,
  PATCH_ACTION
} from './types';
import Utils from '../components/Utils';

export const patchItem = (i, updatedItem) => dispatch => {
  return new Promise((resolve, reject) => {
    Utils.patchResource(i, updatedItem, (body => {
      let item = Utils.reform(body);
      dispatch({
        type: PATCH_ITEM,
        item,
      });
      resolve(item);
    }));
  });
};

export const deleteItem = (itemID) => dispatch => {
  Utils.delete("items/" + itemID, (() => {
    dispatch({
      type: DELETE_ITEM,
    });
  }));
};

export const postAction = (updatedAction) => dispatch => {
  return new Promise((resolve, reject) => {
    Utils.postResource("actions", updatedAction, (body => {
      let action = Utils.reform(body);
      dispatch({
        type: POST_ACTION,
        action,
      });
      resolve(action);
    }));
  });
};


export const postItem = (updatedItem) => dispatch => {
  return new Promise((resolve, reject) => {
    Utils.postResource("items", updatedItem, (body => {
      let item = Utils.reform(body);
      dispatch({
        type: POST_ITEM,
        item,
      });
      resolve(item);
    }));
  });
};

export const patchAction = (path, updatedAction) => dispatch => {
  return new Promise((resolve, reject) => {
    Utils.patch(path, updatedAction, (body => {
      let action = Utils.reform(body);
      dispatch({
        type: PATCH_ACTION,
        action,
      });
      resolve(action);
    }));
  });
};
