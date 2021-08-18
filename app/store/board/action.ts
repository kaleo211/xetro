import { BoardActionTypes, ApplicationState, AppThunk } from '../types';
import Utils from '../../components/Utils';
import { setPage } from '../local/action';
import { Dispatch } from 'redux';
import { keyable } from '../../../utils/tool';

export const fetchGroupActiveBoard = (groupID:string): AppThunk => {
  return async (dispatch: Dispatch): Promise<void> => {
    const board = await Utils.fetch(`/boards/active/${groupID}`);
    if (!board) {
      console.error('error fetching active board');
    }
    dispatch({
      type: BoardActionTypes.SET_BOARD,
      board,
    });
  }
};


export const joinOrCreateBoard = (): AppThunk => {
  return (dispatch: Dispatch, state: () => ApplicationState): void => {
    const { group } = state().group;
    const { board } = state().board;
    if (board && board.id) {
      dispatch(setBoard(board.id));

    } else {
      const now = new Date();
      const boardName = `${now.getMonth()}/${now.getDate()}/${now.getFullYear()}`;
      const newBoard = {
        stage: 'created',
        groupID: group.id,
        name: boardName,
      };
      dispatch(postBoard(newBoard));
    }

    dispatch(setPage('board'));
  }
}

export const refreshBoard = (): AppThunk => {
  return (dispatch:Dispatch, state: ()=>ApplicationState) => {
    const { board } = state().board;
    if (board && board.id) {
      dispatch(setBoard(board.id));
    } else {
      console.error('error refreshing board');
    }
  }
}

export const postBoard = (newBoard:keyable): AppThunk => {
  return async (dispatch:Dispatch): Promise<void> => {
    const board = await Utils.post('boards', newBoard);
    if (board) {
      dispatch({
        type: BoardActionTypes.SET_BOARD,
        board,
      });
    } else {
      console.error('error posting new board');
    }
  }
};


export const listBoards = (groupID: string):AppThunk => {
  return async (dispatch:Dispatch): Promise<void> => {
    const boards = await Utils.fetch(`/boards/group/${groupID}`);
    if (boards) {
      dispatch({
        type: BoardActionTypes.SET_HISTORY_BOARDS,
        historyBoards: boards,
      });
    } else {
      console.error('error listing boards');
    }
  }
};

export const setBoards = ():AppThunk => {
  return async (dispatch:Dispatch): Promise<void> => {
    const boards = await Utils.fetch('boards');
    if (boards) {
      dispatch({
        type: BoardActionTypes.SET_BOARDS,
        boards,
      });
    }
  }
};

export const setBoard = (boardID: string): AppThunk => {
  return async (dispatch: Dispatch): Promise<void> => {
    if (boardID == null || boardID == '') {
      dispatch({
        type: BoardActionTypes.SET_BOARD,
        board: null,
      });
      return;
    }

    const board = await Utils.get('boards', boardID);
    if (!board) {
      console.error('error getting board');
      return;
    }

    dispatch({
      type: BoardActionTypes.SET_BOARD,
      board,
    });
  }
};

export const archiveBoard = (boardID: string):AppThunk => {
  return async (dispatch:Dispatch): Promise<void> => {
    await Utils.fetch(`/boards/${boardID}/archive`);
    dispatch(setPage('group'));
  }
};


export const lockBoard = (boardID: string):AppThunk => {
  return async (dispatch:Dispatch): Promise<void> => {
    await Utils.fetch(`/boards/${boardID}/lock`);
    dispatch(setBoard(boardID));
  }
};


export const unlockBoard = (boardID:string): AppThunk => {
  return async (dispatch:Dispatch): Promise<void> => {
    await Utils.fetch(`/boards/${boardID}/unlock`);
    dispatch(setBoard(boardID));
  }
};
