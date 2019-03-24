import {
  DELETE_ITEM,
  POST_ACTION,
  PATCH_ACTION,
} from '../actions/types';

const initialState = {
};

export default function (state = initialState, action) {
  switch (action.type) {
    case DELETE_ITEM:
      return { ...state };

    case POST_ACTION:
      return {
        ...state,
        action: action.action
      };

    case PATCH_ACTION:
      return {
        ...state,
        action: action.action
      };

    default:
      return state;
  }
}
