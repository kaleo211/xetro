import {
  SET_BOARD,
  SET_BOARDS,
  SET_PILLARS,
  SET_HISTORY_BOARDS,
} from '../actions/types';

const initialState = {
  boards: [],
  board: null,
  historyBoards: [],
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
        board: action.board,
      };

    case SET_PILLARS:
      return {
        ...state,
        pillars: action.pillars,
      };

    case SET_HISTORY_BOARDS:
      return {
        ...state,
        historyBoards: action.historyBoards,
      };

    default:
      return state;
  }
}
