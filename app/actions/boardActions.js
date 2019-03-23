import {
  FETCH_ACTIVE_BOARDS,
  FETCH_BOARD,
  FETCH_GROUP_ACTIVE_BOARDS,
  PATCH_BOARD,
  POST_BOARD,
  SET_ACTIVE_MEMBER,
  SHOW_PAGE,
  FETCH_BOARDS,
} from './types';
import Utils from '../components/Utils';

export const fetchGroupActiveBoards = (groupID) => {
  return (dispatch) => {
    Utils.fetch(`/group/${groupID}/active`).then(body => {
      let page = 'createBoard';
      let boards = body || [];

      if (boards) {
        if (boards.length === 1) {
          dispatch(setBoard(boards[0].id));
          page = "board";
        } if (boards.length > 1) {
          page = "boardList";
        }
      }

      dispatch({
        type: FETCH_GROUP_ACTIVE_BOARDS,
        boards
      });
      dispatch({
        type: SHOW_PAGE,
        page,
      });
    });
  };
};

export const fetchActiveBoards = () => {
  return (dispatch) => {
    Utils.fetch('/boards/active').then(boards => {
      dispatch({
        type: FETCH_ACTIVE_BOARDS,
        boards,
      });
    });
  };
};

export const postBoard = (newBoard) => {
  return (dispatch) => {
    Utils.post('boards', newBoard).then(board => {
      dispatch({
        type: POST_BOARD,
        board,
      });
    });
  };
};

export const fetchBoards = () => {
  return (dispatch) => {
    return Utils.list("board").then(boards => {
      dispatch({
        type: FETCH_BOARDS,
        boards,
      });
    });
  };
};

export const patchBoard = (b, board) => {
  return (dispatch) => {
    Utils.patchResource(b, board).then(body => {
      let board = Utils.reform(body);
      dispatch({
        type: PATCH_BOARD,
        board
      });
    });
  };
};

export const setBoard = (boardID) => {
  return (dispatch) => {
    if (boardID === null || boardID === "") {
      dispatch({
        type: FETCH_BOARD,
        board: null
      });
    } else {
      Utils.get('board', boardID).then(board => {
        dispatch({
          type: FETCH_BOARD,
          board,
        });
      });
    }
  };
};

export const setActiveMember = (user) => {
  return (dispatch) => {
    dispatch({
      type: SET_ACTIVE_MEMBER,
      activeMember,
    });
  };
};
