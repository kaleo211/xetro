import { Socket } from "socket.io";
import { ThunkAction } from "redux-thunk";
import { Action } from "redux";

import { BoardI, GroupI, ItemI, UserI } from "../../types/models";
import { Keyable } from "../../types/common";

export enum LocalTaskTypes {
  SET_PAGE = 0,
  SET_ELMO,
  SET_ITEM,
  SET_HOVER_ITEM,
  UPDATE_SHOW_ACTION_MAP,
  UPDATE_SHOW_ADDING_ACTION,
  SET_ACTIVE_ITEM_PROGRESS,
  SET_SOCKETIO_CLIENT,
  SET_ACTIVE_ITEM_PROGRESS_TIMER,
}

export interface LocalStateI {
  page: string
  activeItem: ItemI
  hoveredItem: ItemI
  showTaskMap: Keyable
  elmo: boolean
  addingTask: boolean
  secondsPerItem: number
  socketIOClient: Socket
  activeItemProgress: number
  activeItemProgressTimer: NodeJS.Timer
}

export enum UserTaskTypes {
  SET_USERS = 100,
  SET_ME,
  FAILED,
}

export interface UserStateI {
  users: UserI[],
  me: UserI,
}

export enum BoardTaskTypes {
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

export enum GroupTaskTypes {
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
