import { SHOW_PAGE, OPEN_SNACKBAR, CLOSE_SNACKBAR, SELECT_ITEM } from './types';

export const showPage = (page) => dispatch => {
  dispatch({
    type: SHOW_PAGE,
    page
  });
};

export const openSnackBar = (snackbarMessage) => dispatch => {
  dispatch({
    type: OPEN_SNACKBAR,
    snackbarMessage,
    snackbarOpen: true
  });
}

export const closeSnackBar = () => dispatch => {
  console.log("closing snack bar");
  dispatch({
    type: CLOSE_SNACKBAR,
    snackbarOpen: false
  });
}

export const selectItem = (item) => dispatch => {
  dispatch({
    type: SELECT_ITEM,
    selectedItem: item
  })
}
