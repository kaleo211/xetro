import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

import {
  SET_ITEM,
  SET_HOVER_ITEM,
  SHOW_PAGE,
  UPDATE_SHOW_ACTION_MAP,
  UPDATE_SHOW_ADDING_ACTION,
} from '../actions/types';

const persistConfig = {
  storage,
  key: 'local',
  stateReconciler: autoMergeLevel2,
};

const initialState = {
  page: 'home',
  activeItem: {},
  hoveredItem: {},
  showActionMap: {},
};

const localReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_PAGE:
      return {
        ...state,
        page: action.page,
      };

    case SET_ITEM:
      return {
        ...state,
        activeItem: action.activeItem,
      };

    case SET_HOVER_ITEM:
      return {
        ...state,
        hoveredItem: action.hoveredItem,
      };

    case UPDATE_SHOW_ACTION_MAP:
      return {
        ...state,
        showActionMap: {
          ...state.showActionMap,
          [action.itemID]: action.show,
        },
      };

    case UPDATE_SHOW_ADDING_ACTION:
      return {
        ...state,
        addingAction: action.addingAction,
      };

    default:
      return state;
  }
};

export default persistReducer(persistConfig, localReducer);
