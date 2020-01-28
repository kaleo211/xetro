import {
  SET_BOARD,
  SET_BOARDS,
  SET_ACTIVE_BOARD,
  SET_HISTORY_BOARDS,
} from './types';
import Utils from '../components/Utils';
import { setPage } from './localActions';

export const fetchGroupActiveBoard = (groupID) => async (dispatch) => {
  const board = await Utils.fetch(`/boards/active/${groupID}`);
  if (!board) {
    console.error('error fetching active board');
  }
  dispatch({
    type: SET_ACTIVE_BOARD,
    activeBoard: board,
  });
};

export const joinOrCreateBoard = () => {
  return (dispatch, getState) => {
    const { group } = getState().groups;
    const { activeBoard } = getState().boards;

    if (activeBoard) {
      dispatch(setBoard(activeBoard.id));

    } else {
      const now = new Date();
      const boardName = `${now.getMonth()}/${now.getDate()}/${now.getFullYear()}`;
      const randomIndex = Math.floor(Math.random() * (group.members.length));
      const newBoard = {
        stage: 'created',
        groupID: group.id,
        name: boardName,
        facilitatorID: group.members[randomIndex].id,
      };
      dispatch(postBoard(newBoard));
    }

    dispatch(setPage('board'));
  }
}

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

export const listBoards = (groupID) => async (dispatch) => {
  const boards = await Utils.fetch(`/boards/group/${groupID}`);
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

export const setBoard = (boardID) => async (dispatch) => {
  if (boardID == null || boardID === '') {
    dispatch({
      type: SET_BOARD,
      board: null,
    });
  } else {
    const board = await Utils.get('boards', boardID);
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

export const archiveBoard = (boardID) => async (dispatch) => {
  await Utils.fetch(`/boards/${boardID}/archive`);
  dispatch(setPage('group'));
};

export const lockBoard = (boardID) => async (dispatch) => {
  await Utils.fetch(`/boards/${boardID}/lock`);
  dispatch(setBoard(boardID));
};

export const unlockBoard = (boardID) => async (dispatch) => {
  await Utils.fetch(`/boards/${boardID}/unlock`);
  dispatch(setBoard(boardID));
};
