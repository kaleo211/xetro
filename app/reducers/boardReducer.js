import {
  SET_BOARD,
  SET_BOARDS,
  SET_PILLARS,
} from '../actions/types';

const initialState = {
  boards: [],
  board: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_BOARDS:
      return {
        ...state,
        boards: action.boards,
      };

    case SET_BOARD:
      return {
        ...state,
        board: action.board
      }

    case SET_PILLARS:
      return {
        ...state,
        pillars: action.pillars,
      }

    default:
      return state;
  }
}
