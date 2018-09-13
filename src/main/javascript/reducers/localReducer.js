import {
  SHOW_PAGE,
  CLOSE_SNACKBAR,
  OPEN_SNACKBAR,
  SELECT_ITEM,
} from '../actions/types';

const initialState = {
  page: "",
  snackbarOpen: false,
  snackbarMessage: "",
  selectedItemID: null,
};

export default function (state = initialState, action) {
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

    case SELECT_ITEM:
      return {
        ...state,
        selectedItemID: action.selectedItemID
      };

    default:
      return state;
  }
}
