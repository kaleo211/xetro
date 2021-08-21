import { Dispatch } from 'redux';

import { TaskI, ItemI } from '../../../types/models';
import { setActiveItem } from '../local/action';
import { getMeRaw } from '../user/action';
import { ApplicationState, AppThunk } from '../types';
import { setBoardRaw } from '../board/action';
import { deleteReq, fetchReq, postReq, touchReq } from '../../utils';


export const likeItemThunk = (item: ItemI): AppThunk => {
  return async (dispatch: Dispatch, getState: ()=>ApplicationState) => {
    await touchReq(`/items/${item.id}/like`);
    dispatch(await setBoardRaw(getState().board.board.id));
  }
};

export const finishItemAction = async (item: ItemI): Promise<void> => {
  await touchReq(`/items/${item.id}/finish`);
}

export const finishItemThunk = (item: ItemI): AppThunk => {
  return async (dispatch: Dispatch, getState: () => ApplicationState) => {
    finishItemAction(item);
    dispatch(await setBoardRaw(getState().board.board.id));
  }
};

export const startItemThunk = (item: ItemI): AppThunk => {
  return async (dispatch: Dispatch, getState: () => ApplicationState) => {
    const now = new Date();
    now.setSeconds(now.getSeconds() + getState().local.secondsPerItem);
    const activeItem = await postReq(`items/${item.id}/start`, { end: new Date(now) });
    if (activeItem) {
      dispatch(setActiveItem(activeItem as ItemI));
      dispatch(await setBoardRaw(getState().board.board.id));
    }
  }
};

export const deleteItemThunk = (item: ItemI): AppThunk => {
  return async (dispatch: Dispatch, getState: ()=>ApplicationState) => {
    await deleteReq('items', item.id);
    dispatch(await setBoardRaw(getState().board.board.id));
  }
};

export const postItemThunk = (item: ItemI): AppThunk => {
  return async (dispatch: Dispatch, getState: ()=>ApplicationState) => {
    await postReq('items', item);
    dispatch(await setBoardRaw(getState().board.board.id));
  }
};

export const finishTaskThunk = (task: TaskI): AppThunk => {
  return async (dispatch: Dispatch, getState: () => ApplicationState) => {
    await fetchReq(`/tasks/${task.id}/finish`);
    dispatch(await getMeRaw());
    dispatch(await setBoardRaw(getState().board.board.id));
  }
};

export const deleteTask = (task: TaskI): AppThunk => {
  return async (dispatch: Dispatch, getState: () => ApplicationState) => {
    await deleteReq('tasks', task.id);
    dispatch(await setBoardRaw(getState().board.board.id));
  }
};

export const startTask = (task: TaskI): AppThunk => {
  return async (dispatch: Dispatch, getState: () => ApplicationState) => {
    await fetchReq(`/task/${task.id}/start`);
    dispatch(await setBoardRaw(getState().board.board.id));
    // dispatch(setGroup(task.groupID));
  }
};

export const postTask = (task: TaskI): AppThunk => {
  return async (dispatch: Dispatch, getState: () => ApplicationState) => {
    await postReq('tasks', task);
    dispatch(await setBoardRaw(getState().board.board.id));
    // dispatch(setGroup(task.groupID));
  }
};
