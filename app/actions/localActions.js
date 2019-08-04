import {
  SHOW_PAGE,
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
  SET_ITEM,
  SET_DRAW,
} from './types';

export const setPage = (page) => ({
  type: SHOW_PAGE,
  page,
});

export const openSnackBar = (snackbarMessage) => ({
  type: OPEN_SNACKBAR,
  snackbarMessage,
  snackbarOpen: true,
});

export const closeSnackBar = () => ({
  type: CLOSE_SNACKBAR,
  snackbarOpen: false,
});

export const setActiveItem = (item) => ({
  type: SET_ITEM,
  activeItem: item,
});

export const openDraw = () => ({
  type: SET_DRAW,
  drawOpen: true,
});

export const closeDraw = () => ({
  type: SET_DRAW,
  drawOpen: false,
});
