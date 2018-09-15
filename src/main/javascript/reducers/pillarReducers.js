import {
  POST_PILLAR,
  PATCH_PILLAR,
} from '../actions/types';

const initialState = {
  board: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case POST_PILLAR:
    case PATCH_PILLAR:
      return {
        ...state,
        pillar: action.pillar
      };

    default:
      return state;
  }
}
