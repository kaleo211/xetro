import {
  SHOW_PAGE,
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
  SET_ITEM,
} from './types';

export const setPage = (page) => {
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

export const setActiveItem = (item) => {
  return {
    type: SET_ITEM,
    activeItem: item,
  };
}
