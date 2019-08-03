import {
  SET_BOARD,
  SET_BOARDS,
  SET_ACTIVE_BOARD,
  SET_HISTORY_BOARDS,
} from './types';
import Utils from '../components/Utils';
import { setPage } from './localActions';

export const fetchGroupActiveBoard = (groupId) => {
  return async (dispatch) => {
    const resp = await fetch(`/boards/active/${groupId}`);
    if (resp) {
      const body = await resp.json();
      dispatch({
        type: SET_ACTIVE_BOARD,
        activeBoard: body,
      });
    }
  };
};

export const postBoard = (newBoard) => {
  return async (dispatch) => {
    const resp = await Utils.po('boards', newBoard);
    if (resp) {
      const body = await resp.json();
      dispatch({
        type: SET_BOARD,
        board: body,
      });
    }
  };
};

export const listBoards = (groupId) => {
  return async (dispatch) => {
    const resp = await fetch(`/boards/group/${groupId}`);
    if (resp) {
      const body = await resp.json();
      const historyBoards = body || [];
      dispatch({
        type: SET_HISTORY_BOARDS,
        historyBoards,
      });
    }
  };
};

export const setBoards = () => {
  return async (dispatch) => {
    const resp = await fetch('boards');
    if (resp) {
      const body = await resp.json();
      const boards = body || [];
      dispatch({
        type: SET_BOARDS,
        boards,
      });
    }
  };
};

export const setBoard = (boardId) => {
  return (dispatch) => {
    if (boardId == null || boardId === '') {
      dispatch({
        type: SET_BOARD,
        board: null,
      });
    } else {
      Utils.get('boards', boardId).then(body => {
        dispatch({
          type: SET_BOARD,
          board: body,
        });
      });
    }
  };
};

export const archiveBoard = (boardId) => {
  return (dispatch) => {
    Utils.fetch(`/boards/${boardId}/archive`);
    dispatch(setPage('group'));
  };
};

export const lockBoard = (boardId) => {
  return (dispatch) => {
    Utils.fetch(`/boards/${boardId}/lock`);
    dispatch(setBoard(boardId));
  };
};

export const unlockBoard = (boardId) => {
  return (dispatch) => {
    Utils.fetch(`/boards/${boardId}/unlock`);
    dispatch(setBoard(boardId));
  };
};
