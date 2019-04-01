import {
  SET_BOARD,
  SET_BOARDS,
  SET_HISTORY_BOARDS,
} from './types';
import Utils from '../components/Utils';
import { setPage } from './localActions';
import { postPillar } from './pillarActions';

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

      dispatch(postPillar({ title: ':)', boardId: body.id }))
      dispatch(postPillar({ title: ':|', boardId: body.id }))
      dispatch(postPillar({ title: ':(', boardId: body.id }))
    });
  };
};

export const listBoards = (groupId) => {
  return (dispatch) => {
    Utils.fetch(`/boards/group/${groupId}`).then(body => {
      let historyBoards = body || [];
      dispatch({
        type: SET_HISTORY_BOARDS,
        historyBoards,
      });
    });
  };
}

export const setBoards = () => {
  return (dispatch) => {
    return Utils.list("boards").then(body => {
      let boards = body || [];
      dispatch({
        type: SET_BOARDS,
        boards,
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
  }
}

export const lockBoard = (boardId) => {
  return (dispatch) => {
    Utils.fetch(`/boards/${boardId}/lock`);
    dispatch(setBoard(boardId));
  }
}

export const unlockBoard = (boardId) => {
  return (dispatch) => {
    Utils.fetch(`/boards/${boardId}/unlock`);
    dispatch(setBoard(boardId));
  }
}
