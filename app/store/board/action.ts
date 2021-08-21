import { AnyAction, Dispatch } from 'redux';

import { BoardTaskTypes, ApplicationState, AppThunk } from '../types';
import { setPage } from '../local/action';
import { Keyable } from '../../../types/common';
import { fetchReq, getReq, postReq } from '../../utils';

export const fetchGroupActiveBoardRaw = async (groupID: string): Promise<AnyAction> => {
  const board = await fetchReq(`/boards/active/${groupID}`);
  if (!board) {
    return {
      type: BoardTaskTypes.FAILED,
      error: 'error fetching active board',
    }
  }

  return {
    type: BoardTaskTypes.SET_BOARD,
    board,
  };
}

export const fetchGroupActiveBoard = (groupID:string): AppThunk => {
  return async (dispatch: Dispatch): Promise<void> => {
    dispatch(await fetchGroupActiveBoardRaw(groupID));
  }
};


export const joinOrCreateBoard = (): AppThunk => {
  return async (dispatch: Dispatch, state: () => ApplicationState): Promise<void> => {
    const { group } = state().group;
    const { board } = state().board;

    if (board && board.id) {
      dispatch(await setBoardRaw(board.id));

    } else {
      const now = new Date();
      const boardName = `${now.getMonth()}/${now.getDate()}/${now.getFullYear()}`;
      const newBoard = {
        stage: 'created',
        groupID: group.id,
        name: boardName,
      };
      dispatch(await postBoardRaw(newBoard));
    }

    dispatch(setPage('board'));
  }
}


export const refreshBoard = (): AppThunk => {
  return async (dispatch:Dispatch, state: ()=>ApplicationState) => {
    const { board } = state().board;
    if (board && board.id) {
      dispatch(await setBoardRaw(board.id));
    } else {
      console.error('error refreshing board');
    }
  }
}

export const postBoardRaw = async (newBoard: Keyable): Promise<AnyAction> => {
  const board = await postReq('boards', newBoard);
  if (board) {
    return {
      type: BoardTaskTypes.SET_BOARD,
      board,
    };
  }

  return {
    type: BoardTaskTypes.FAILED,
  };
}

export const postBoard = (newBoard:Keyable): AppThunk => {
  return async (dispatch:Dispatch): Promise<void> => {
    dispatch(await postBoardRaw(newBoard));
  }
};


export const listBoards = (groupID: string):AppThunk => {
  return async (dispatch:Dispatch): Promise<AnyAction> => {
    const boards = await fetchReq(`/boards/group/${groupID}`);
    if (boards) {
      return dispatch({
        type: BoardTaskTypes.FAILED,
        error: 'error listing boards',
      });
    }

    return dispatch({
      type: BoardTaskTypes.SET_HISTORY_BOARDS,
      historyBoards: boards,
    });
  }
};

export const setBoards = ():AppThunk => {
  return async (dispatch:Dispatch): Promise<AnyAction> => {
    const boards = await fetchReq('boards');
    if (boards) {
      return dispatch({
        type: BoardTaskTypes.SET_BOARDS,
        boards,
      });
    }
  }
};

export const setBoardRaw = async (boardID: string): Promise<AnyAction> => {
  if (boardID == null || boardID === '') {
    return {
      type: BoardTaskTypes.SET_BOARD,
      board: null,
    };
  }

  const board = await getReq('boards', boardID);
  if (!board) {
    console.error('error getting board');
    return {
      type: BoardTaskTypes.FAILED,
    };
  }

  return {
    type: BoardTaskTypes.SET_BOARD,
    board,
  };
}

export const setBoard = (boardID: string): AppThunk => {
  return async (dispatch: Dispatch): Promise<void> => {
    const result = await setBoardRaw(boardID);
    dispatch(result);
  }
};

export const archiveBoard = (boardID: string):AppThunk => {
  return async (dispatch:Dispatch): Promise<void> => {
    await fetchReq(`/boards/${boardID}/archive`);
    dispatch(setPage('group'));
  }
};


export const lockBoard = (boardID: string):AppThunk => {
  return async (dispatch:Dispatch): Promise<void> => {
    await fetchReq(`/boards/${boardID}/lock`);
    dispatch(await setBoardRaw(boardID));
  }
};


export const unlockBoard = (boardID:string): AppThunk => {
  return async (dispatch:Dispatch): Promise<void> => {
    await fetchReq(`/boards/${boardID}/unlock`);
    dispatch(await setBoardRaw(boardID));
  }
};
