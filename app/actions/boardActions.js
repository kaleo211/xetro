import {
  FETCH_ACTIVE_BOARDS,
  SET_BOARD,
  FETCH_GROUP_ACTIVE_BOARDS,
  PATCH_BOARD,
  POST_BOARD,
  SET_ACTIVE_MEMBER,
  SET_BOARDS,
} from './types';
import Utils from '../components/Utils';
import { setPage } from './localActions';

export const fetchGroupActiveBoards = (groupId) => {
  return (dispatch) => {
    Utils.fetch(`/boards/active/${groupId}`).then(body => {
      let page;
      let boards = body || [];

      if (boards.length === 0) {
        page = 'createBoard';
      } else if (boards.length === 1) {
        dispatch(setBoard(boards[0].id));
        page = "board";
      } else if (boards.length > 1) {
        page = "boardList";
      }

      dispatch({
        type: FETCH_GROUP_ACTIVE_BOARDS,
        boards
      });
      dispatch(setPage(page));
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
      console.log('board', newBoard);

      dispatch({
        type: POST_BOARD,
        board,
      });
    });
  };
};

export const fetchBoards = () => {
  return (dispatch) => {
    return Utils.list("boards").then(boards => {
      dispatch({
        type: SET_BOARDS,
        boards,
      });
    });
  };
};

export const patchBoard = (b, board) => {
  return (dispatch) => {
  };
};

export const setBoard = (boardId) => {
  return (dispatch) => {
    if (boardId == null || boardId === '') {
      dispatch({
        type: SET_BOARD,
        board: null
      });
    } else {
      Utils.get('boards', boardId).then(board => {
        dispatch({
          type: SET_BOARD,
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
