import { Socket } from "socket.io";
import { BoardI, GroupI, ItemI, UserI } from "types/models";
import { Keyable } from "types/common";
import { ThunkAction } from "redux-thunk";
import { Action } from "redux";

export enum LocalActionTypes {
  SET_PAGE = 0,
  SET_ELMO,
  SET_ITEM,
  SET_HOVER_ITEM,
  SET_ELMOSET_PAGE,
  UPDATE_SHOW_ACTION_MAP,
  UPDATE_SHOW_ADDING_ACTION,
  UPDATE_SHOW_ACTION_MAPSET_PAGE,
  UPDATE_SHOW_ADDING_ACTIONSET_PAGE,
  SET_ACTIVE_ITEM_PROGRESSSET_PAGE,
  SET_ACTIVE_ITEM_PROGRESS,
  SET_SOCKETIO_CLIENT,
  SET_ACTIVE_ITEM_PROGRESS_TIMER,
}

export interface LocalStateI {
  page: string
  activeItem: ItemI
  hoveredItem: ItemI
  showActionMap: Keyable
  elmo: boolean
  addingAction: boolean
  secondsPerItem: number
  socketIOClient: Socket
  activeItemProgress: number
  activeItemProgressTimer: NodeJS.Timer
}

export enum UserActionTypes {
  SET_USERS = 100,
  SET_ME,
  FAILED,
}

export interface UserStateI {
  users: UserI[],
  me: UserI,
}

export enum BoardActionTypes {
  SET_BOARD = 200,
  SET_BOARDS,
  SET_PILLARS,
  SET_HISTORY_BOARDS,
  FAILED,
}

export interface BoardStateI {
  boards: BoardI[],
  board: BoardI,
  historyBoards: BoardI[],
}

export enum GroupActionTypes {
  SET_GROUP = 300,
  SET_GROUPS,
  FAILED,
}

export interface GroupStateI {
  groups: GroupI[],
  group: GroupI,
}

export interface ApplicationState {
	board: BoardStateI;
  group: GroupStateI;
  local: LocalStateI;
  user: UserStateI;
}

export type AppThunk = ThunkAction<void, ApplicationState, unknown, Action<string>>;
