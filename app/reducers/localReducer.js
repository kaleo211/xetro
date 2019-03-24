import {
  SHOW_PAGE,
  CLOSE_SNACKBAR,
  OPEN_SNACKBAR,
  SELECT_ITEM,
} from '../actions/types';

import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

const persistConfig = {
  key: 'local',
  storage: storage,
  stateReconciler: autoMergeLevel2
};

const initialState = {
  page: "",
  snackbarOpen: false,
  snackbarMessage: "",
  selectedItem: {},
};

const localReducer = function (state = initialState, action) {
  switch (action.type) {
    case SHOW_PAGE:
      console.log('page:', action.page);
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

    case SELECT_ITEM:
      return {
        ...state,
        selectedItem: action.selectedItem
      };

    default:
      return state;
  }
};

export default persistReducer(persistConfig, localReducer);
