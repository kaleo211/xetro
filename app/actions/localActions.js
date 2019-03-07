import {
  SHOW_PAGE,
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
  SELECT_ITEM,
} from './types';

export const showPage = (page) => {
  return {
    type: SHOW_PAGE,
    page,
  };
};

export const openSnackBar = (snackbarMessage) => {
  return {
    type: OPEN_SNACKBAR,
    snackbarMessage,
    snackbarOpen: true,
  };
}

export const closeSnackBar = () => {
  return {
    type: CLOSE_SNACKBAR,
    snackbarOpen: false,
  };
}

export const selectItem = (item) => {
  return {
    type: SELECT_ITEM,
    selectedItem: item,
  };
}
