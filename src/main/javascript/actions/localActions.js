import { SHOW_PAGE } from './types';

export const showPage = (page) => dispatch => {
  dispatch({
    type: SHOW_PAGE,
    page
  });
};
