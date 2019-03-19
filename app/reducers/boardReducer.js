import {
  FETCH_ACTIVE_BOARDS,
  FETCH_BOARD,
  FETCH_GROUP_ACTIVE_BOARDS,
  PATCH_BOARD,
  POST_BOARD,
  SET_ACTIVE_MEMBER,
  FETCH_BOARDS,
} from '../actions/types';

const initialState = {
  boards: [],
  board: null,
  activeMember: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_GROUP_ACTIVE_BOARDS:
    case FETCH_BOARDS:
      return {
        ...state,
        boards: action.boards,
      };

    case FETCH_ACTIVE_BOARDS:
      let result = {
        ...state,
        boards: action.boards
      }
      if (action.boards && action.boards.length === 1) {
        result.board = action.boards[0];
      }
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
      return {
        ...state,
        board: action.board
      }

    case SET_ACTIVE_MEMBER:
      return {
        ...state,
        activeMember: action.activeMember
      }

    default:
      return state;
  }
}
