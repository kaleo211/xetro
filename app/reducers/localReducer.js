import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

import {
  CLOSE_SNACKBAR,
  OPEN_SNACKBAR,
  SET_DRAW,
  SET_ITEM,
  SHOW_PAGE,
  UPDATE_SHOW_ACTION_MAP,
} from '../actions/types';

const persistConfig = {
  storage,
  key: 'local',
  stateReconciler: autoMergeLevel2,
};

const initialState = {
  page: 'home',
  snackbarOpen: false,
  snackbarMessage: '',
  activeItem: {},
  drawOpen: false,
  showActionMap: {},
};

const localReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_PAGE:
      return {
        ...state,
        page: action.page,
      };

    case OPEN_SNACKBAR:
      return {
        ...state,
        snackbarMessage: action.snackbarMessage,
        snackbarOpen: action.snackbarOpen,
      };

    case CLOSE_SNACKBAR:
      return {
        ...state,
        snackbarOpen: action.snackbarOpen,
      };

    case SET_ITEM:
      return {
        ...state,
        activeItem: action.activeItem,
      };

    case SET_DRAW:
      return {
        ...state,
        drawOpen: action.drawOpen,
      };

    case UPDATE_SHOW_ACTION_MAP:
      return {
        ...state,
        showActionMap: {
          ...state.showActionMap,
          [action.itemID]: action.show,
        },
      };

    default:
      return state;
  }
};

export default persistReducer(persistConfig, localReducer);
