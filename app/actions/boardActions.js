import {
  SET_BOARD,
  SET_BOARDS,
} from './types';
import Utils from '../components/Utils';
import { setPage } from './localActions';
import { setPillars } from './pillarActions';

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
        type: SET_BOARDS,
        boards
      });
      dispatch(setPage(page));
    });
  };
};

export const postBoard = (newBoard) => {
  return (dispatch) => {
    Utils.post('boards', newBoard).then(body => {
      dispatch({
        type: SET_BOARD,
        board: body
      });
    });
  };
};

export const fetchBoards = () => {
  return (dispatch) => {
    return Utils.list("boards").then(body => {
      dispatch({
        type: SET_BOARDS,
        boards: body,
      });
    });
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
      Utils.get('boards', boardId).then(body => {
        dispatch(setPillars(boardId));
        dispatch({
          type: SET_BOARD,
          board: body,
        });
      });
    }
  };
};
