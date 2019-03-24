import {
  FETCH_ACTIVE_BOARDS,
  SET_BOARD,
  FETCH_GROUP_ACTIVE_BOARDS,
  PATCH_BOARD,
  POST_BOARD,
  SET_ACTIVE_MEMBER,
  SET_BOARDS,
  SET_PILLARS,
} from '../actions/types';

const initialState = {
  boards: [],
  board: null,
  activeMember: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_GROUP_ACTIVE_BOARDS:
    case SET_BOARDS:
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

    case SET_BOARD:
      return {
        ...state,
        board: action.board
      }

    case SET_ACTIVE_MEMBER:
      return {
        ...state,
        activeMember: action.activeMember
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
