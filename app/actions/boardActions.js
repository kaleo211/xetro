import {
  SET_BOARD,
  SET_BOARDS,
  SET_ACTIVE_BOARD,
  SET_HISTORY_BOARDS,
} from './types';
import Utils from '../components/Utils';
import { setPage } from './localActions';

export const fetchGroupActiveBoard = (groupId) => async (dispatch) => {
  const board = await Utils.fetch(`/boards/active/${groupId}`);
  if (!board) {
    console.error('error fetching active board');
  }
  dispatch({
    type: SET_ACTIVE_BOARD,
    activeBoard: board,
  });
};

export const postBoard = (newBoard) => async (dispatch) => {
  const board = await Utils.post('boards', newBoard);
  if (board) {
    dispatch({
      type: SET_BOARD,
      board,
    });
  } else {
    console.error('error posting new board');
  }
};

export const listBoards = (groupId) => async (dispatch) => {
  const boards = await Utils.fetch(`/boards/group/${groupId}`);
  if (boards) {
    dispatch({
      type: SET_HISTORY_BOARDS,
      historyBoards: boards,
    });
  } else {
    console.error('error listing boards');
  }
};

export const setBoards = () => async (dispatch) => {
  const boards = await Utils.fetch('boards');
  if (boards) {
    dispatch({
      type: SET_BOARDS,
      boards,
    });
  }
};

export const setBoard = (boardId) => async (dispatch) => {
  if (boardId == null || boardId === '') {
    dispatch({
      type: SET_BOARD,
      board: null,
    });
  } else {
    const board = await Utils.get('boards', boardId);
    if (board) {
      dispatch({
        type: SET_BOARD,
        board,
      });
    } else {
      console.error('error getting board');
    }
  }
};

export const archiveBoard = (boardId) => async (dispatch) => {
  await Utils.fetch(`/boards/${boardId}/archive`);
  dispatch(setPage('group'));
};

export const lockBoard = (boardId) => async (dispatch) => {
  await Utils.fetch(`/boards/${boardId}/lock`);
  dispatch(setBoard(boardId));
};

export const unlockBoard = (boardId) => async (dispatch) => {
  await Utils.fetch(`/boards/${boardId}/unlock`);
  dispatch(setBoard(boardId));
};
