import { BoardActionTypes, BoardStateI } from '../types';
import { Reducer } from "redux";

const initialState: BoardStateI = {
  boards: [],
  board: null,
  historyBoards: [],
};

const reducer: Reducer<BoardStateI> = (state = initialState, action) => {
  switch (action.type) {
    case BoardActionTypes.SET_BOARDS:
      return { ...state, boards: action.boards};

    case BoardActionTypes.SET_BOARD:
      return { ...state, board: action.board };

    case BoardActionTypes.SET_PILLARS:
      return { ...state, pillars: action.pillars };

    case BoardActionTypes.SET_HISTORY_BOARDS:
      return { ...state, historyBoards: action.historyBoards };

    default:
      return state;
  }
}

export { reducer as BoardReducer };
