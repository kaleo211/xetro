import {
  SHOW_PAGE,
  CLOSE_SNACKBAR,
  OPEN_SNACKBAR,
  SET_ITEM,
  SET_DRAW,
} from '../actions/types';

import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

const persistConfig = {
  key: 'local',
  storage: storage,
  stateReconciler: autoMergeLevel2,
};

const initialState = {
  page: "",
  snackbarOpen: false,
  snackbarMessage: "",
  activeItem: {},
  drawOpen: true,
};

const localReducer = function (state = initialState, action) {
  switch (action.type) {
    case SHOW_PAGE:
      return {
        ...state,
        page: action.page
      };

    case OPEN_SNACKBAR:
      return {
        ...state,
        snackbarMessage: action.snackbarMessage,
        snackbarOpen: action.snackbarOpen
      };

    case CLOSE_SNACKBAR:
      return {
        ...state,
        snackbarOpen: action.snackbarOpen
      };

    case SET_ITEM:
      return {
        ...state,
        activeItem: action.activeItem
      };

    case SET_DRAW:
      return {
        ...state,
        drawOpen: action.drawOpen,
      }

    default:
      return state;
  }
};

export default persistReducer(persistConfig, localReducer);
