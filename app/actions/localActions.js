import {
  SET_ELMO,
  SET_PAGE,
  SET_ITEM,
  SET_HOVER_ITEM,
  UPDATE_SHOW_ACTION_MAP,
  UPDATE_SHOW_ADDING_ACTION,
  SET_ACTIVE_ITEM_PROGRESS,
  SET_ACTIVE_ITEM_PROGRESS_TIMER,
} from './types';
import { finishItem } from './itemActions';

export const setPage = (page) => ({
  type: SET_PAGE,
  page,
});

export const setActiveItem = (item) => ({
  type: SET_ITEM,
  activeItem: item,
});

export const setHoverItem = (item) => ({
  type: SET_HOVER_ITEM,
  hoveredItem: item,
});

export const showActions = (itemID) => ({
  type: UPDATE_SHOW_ACTION_MAP,
  itemID,
  show: true,
});

export const hideActions = (itemID) => ({
  type: UPDATE_SHOW_ACTION_MAP,
  itemID,
  show: false,
});

export const showGroupPage = () => ({
  type: SET_PAGE,
  page: 'group',
});

export const showAddingAction = () => ({
  type: UPDATE_SHOW_ADDING_ACTION,
  addingAction: true,
});

export const hideAddingAction = () => ({
  type: UPDATE_SHOW_ADDING_ACTION,
  addingAction: false,
});

export const setELMO = (elmo) => ({
  type: SET_ELMO,
  elmo,
});

export const startActiveItemTimer = () => (dispatch, getState) => {
  const { activeItem, secondsPerItem } = getState().local;
  if (activeItem && activeItem.end) {
    const timer = setInterval(() => {
      const difference = (new Date(activeItem.end).getTime() - new Date().getTime()) / 1000;
      let progress = 1;
      if (difference > 0 && difference < secondsPerItem) {
        progress = (secondsPerItem - difference) / secondsPerItem;
      } else {
        clearInterval(timer);
        dispatch(finishItem(activeItem));
        dispatch(setELMO(true));
      }
      dispatch({
        type: SET_ACTIVE_ITEM_PROGRESS,
        activeItemProgress: progress,
      });
    }, 100);
    dispatch({
      type: SET_ACTIVE_ITEM_PROGRESS_TIMER,
      activeItemProgressTimer: timer,
    });
  }
};

export const clearActiveItemTimer = () => (dispatch, getState) => {
  const { activeItemProgressTimer } = getState().local;
  clearInterval(activeItemProgressTimer);
  dispatch({
    type: SET_ACTIVE_ITEM_PROGRESS_TIMER,
    activeItemProgressTimer: null,
  });
};
