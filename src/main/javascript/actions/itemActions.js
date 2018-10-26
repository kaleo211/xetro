import {
  POST_ITEM,
  PATCH_ITEM,
  DELETE_ITEM,
  POST_ACTION,
  PATCH_ACTION
} from './types';
import Utils from '../components/Utils';

export const patchItem = (i, updatedItem) => {
  return new Promise((resolve, reject) => {
    Utils.patchResource(i, updatedItem).then(body => {
      let item = Utils.reform(body);
      resolve({
        type: PATCH_ITEM,
        item,
      });
    });
  });
};

export const deleteItem = (itemID) => {
  return new Promise((resolve, reject) => {
    Utils.delete("items/" + itemID).then(body => {
      resolve({
        type: DELETE_ITEM,
      });
    });
  });
};

export const postAction = (updatedAction) => dispatch => {
  return new Promise((resolve, reject) => {
    Utils.postResource("actions", updatedAction).then(body => {
      let action = Utils.reform(body);
      resolve({
        type: POST_ACTION,
        action,
      });
    });
  });
};


export const postItem = (updatedItem) => {
  return new Promise((resolve, reject) => {
    Utils.postResource("items", updatedItem).then(body => {
      let item = Utils.reform(body);
      resolve({
        type: POST_ITEM,
        item,
      });
    });
  });
};

export const patchAction = (path, updatedAction) => {
  return new Promise((resolve, reject) => {
    Utils.patch(path, updatedAction).then(body => {
      let action = Utils.reform(body);
      resolve({
        type: PATCH_ACTION,
        action,
      });
    });
  });
};
