import {
  FETCH_ACTIVE_BOARDS,
  FETCH_BOARD,
  FETCH_TEAM_ACTIVE_BOARDS,
  PATCH_BOARD,
  POST_BOARD,
  UPDATE_SELECTED_MEMBER,
} from '../actions/types';

const initialState = {
  boards: [],
  board: null,
  selectedMember: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_TEAM_ACTIVE_BOARDS:
      return {
        ...state,
        boards: action.boards
      };

    case FETCH_ACTIVE_BOARDS:
      let result = {
        ...state,
        boards: action.boards
      }
      if (action.boards && action.boards.length === 1) {
        result.board = action.boards[0];
      }

      console.log("fetch active board:", result);
      return result;

    case POST_BOARD:
      return {
        ...state,
        board: action.board
      }


    case PATCH_BOARD:
      return {
        ...state,
        board: action.board
      }

    case FETCH_BOARD:
      console.log("board in reducer:", action.board)
      return {
        ...state,
        board: action.board
      }

    case UPDATE_SELECTED_MEMBER:
      return {
        ...state,
        selectedMember: action.selectedMember
      }

    default:
      return state;
  }
}
