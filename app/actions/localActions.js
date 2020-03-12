import {
  SHOW_PAGE,
  SET_ITEM,
  SET_HOVER_ITEM,
  UPDATE_SHOW_ACTION_MAP,
  UPDATE_SHOW_ADDING_ACTION,
} from './types';

export const setPage = (page) => ({
  type: SHOW_PAGE,
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
  type: SHOW_PAGE,
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
