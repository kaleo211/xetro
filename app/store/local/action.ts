import { Dispatch } from 'redux';
import { Socket } from 'socket.io-client';

import { ApplicationState, AppThunk, LocalTaskTypes } from '../types';
import { ItemI } from '../../../types/models';
import { finishItemAction } from '../item/action';

export const setSocketIOClient = (socketIOClient: Socket) => ({
  type: LocalTaskTypes.SET_SOCKETIO_CLIENT,
  socketIOClient,
});

export const setPage = (page:string) => ({
  type: LocalTaskTypes.SET_PAGE,
  page,
});

export const setActiveItem = (item:ItemI) => ({
  type: LocalTaskTypes.SET_ITEM,
  activeItem: item,
});

export const setHoverItem = (item:ItemI) => ({
  type: LocalTaskTypes.SET_HOVER_ITEM,
  hoveredItem: item,
});

export const showTasks = (itemID:string) => ({
  type: LocalTaskTypes.UPDATE_SHOW_ACTION_MAP,
  itemID,
  show: true,
});

export const hideTasks = (itemID:string) => ({
  type: LocalTaskTypes.UPDATE_SHOW_ACTION_MAP,
  itemID,
  show: false,
});

export const showGroupPage = () => ({
  type: LocalTaskTypes.SET_PAGE,
  page: 'group',
});

export const showAddingTask = () => ({
  type: LocalTaskTypes.UPDATE_SHOW_ADDING_ACTION,
  addingTask: true,
});

export const hideAddingTask = () => ({
  type: LocalTaskTypes.UPDATE_SHOW_ADDING_ACTION,
  addingTask: false,
});

export const setELMO = (elmo:boolean) => ({
  type: LocalTaskTypes.SET_ELMO,
  elmo,
});

export const startActiveItemTimer = ():AppThunk => {
  return async (dispatch: Dispatch, getState: () => ApplicationState) => {
    const { activeItem, secondsPerItem } = getState().local;
    if (activeItem && activeItem.end) {
      const timer = setInterval(async () => {
        const difference = (new Date(activeItem.end).getTime() - new Date().getTime()) / 1000;
        let progress = 1;
        if (difference > 0 && difference < secondsPerItem) {
          progress = (secondsPerItem - difference) / secondsPerItem;
        } else {
          clearInterval(timer);
          await finishItemAction(activeItem);
          dispatch(setELMO(true));
        }
        dispatch({
          type: LocalTaskTypes.SET_ACTIVE_ITEM_PROGRESS,
          activeItemProgress: progress,
        });
      }, 100);
      dispatch({
        type: LocalTaskTypes.SET_ACTIVE_ITEM_PROGRESS_TIMER,
        activeItemProgressTimer: timer,
      });
    }
  }
};

export const clearActiveItemTimer = ():AppThunk => {
  return (dispatch:Dispatch, getState:()=>ApplicationState) => {
    const { activeItemProgressTimer } = getState().local;
    clearInterval(activeItemProgressTimer);
    dispatch({
      type: LocalTaskTypes.SET_ACTIVE_ITEM_PROGRESS_TIMER,
      activeItemProgressTimer: null,
    });
  }
};
