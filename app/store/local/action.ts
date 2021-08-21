import { ApplicationState, AppThunk, LocalActionTypes } from '../types';
import { finishItem, finishItemRaw } from '../item/action';
import { Socket } from 'socket.io-client';
import { ItemI } from '../../../types/models';
import { Dispatch } from 'redux';

export const setSocketIOClient = (socketIOClient: Socket) => ({
  type: LocalActionTypes.SET_SOCKETIO_CLIENT,
  socketIOClient,
});

export const setPage = (page:string) => ({
  type: LocalActionTypes.SET_PAGE,
  page,
});

export const setActiveItem = (item:ItemI) => ({
  type: LocalActionTypes.SET_ITEM,
  activeItem: item,
});

export const setHoverItem = (item:ItemI) => ({
  type: LocalActionTypes.SET_HOVER_ITEM,
  hoveredItem: item,
});

export const showActions = (itemID:string) => ({
  type: LocalActionTypes.UPDATE_SHOW_ACTION_MAP,
  itemID,
  show: true,
});

export const hideActions = (itemID:string) => ({
  type: LocalActionTypes.UPDATE_SHOW_ACTION_MAP,
  itemID,
  show: false,
});

export const showGroupPage = () => ({
  type: LocalActionTypes.SET_PAGE,
  page: 'group',
});

export const showAddingAction = () => ({
  type: LocalActionTypes.UPDATE_SHOW_ADDING_ACTION,
  addingAction: true,
});

export const hideAddingAction = () => ({
  type: LocalActionTypes.UPDATE_SHOW_ADDING_ACTION,
  addingAction: false,
});

export const setELMO = (elmo:boolean) => ({
  type: LocalActionTypes.SET_ELMO,
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
          dispatch(await finishItemRaw(activeItem));
          dispatch(setELMO(true));
        }
        dispatch({
          type: LocalActionTypes.SET_ACTIVE_ITEM_PROGRESS,
          activeItemProgress: progress,
        });
      }, 100);
      dispatch({
        type: LocalActionTypes.SET_ACTIVE_ITEM_PROGRESS_TIMER,
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
      type: LocalActionTypes.SET_ACTIVE_ITEM_PROGRESS_TIMER,
      activeItemProgressTimer: null,
    });
  }
};
