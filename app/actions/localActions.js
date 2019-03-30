import {
  SHOW_PAGE,
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
  SET_ITEM,
  SET_DRAW,
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

export const openDraw = () => {
  return {
    type: SET_DRAW,
    drawOpen: true,
  }
}

export const closeDraw = () => {
  return {
    type: SET_DRAW,
    drawOpen: false,
  }
}
