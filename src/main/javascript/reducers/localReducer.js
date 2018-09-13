import { SHOW_PAGE } from '../actions/types';

const initialState = {
  page: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SHOW_PAGE:
      return {
        ...state,
        page: action.page
      };

    default:
      return state;
  }
}
