import { Reducer } from "redux";

import { BoardTaskTypes, BoardStateI } from '../types';

const initialState: BoardStateI = {
  boards: [],
  board: null,
  historyBoards: [],
};

const reducer: Reducer<BoardStateI> = (state = initialState, task) => {
  switch (task.type) {
    case BoardTaskTypes.SET_BOARDS:
      return { ...state, boards: task.boards};

    case BoardTaskTypes.SET_BOARD:
      return { ...state, board: task.board };

    case BoardTaskTypes.SET_PILLARS:
      return { ...state, pillars: task.pillars };

    case BoardTaskTypes.SET_HISTORY_BOARDS:
      return { ...state, historyBoards: task.historyBoards };

    case BoardTaskTypes.FAILED:
      console.error(task.error);

    default:
      return state;
  }
}

export { reducer as BoardReducer };
