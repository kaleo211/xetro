// import storage from 'redux-persist/lib/storage';
// import { persistReducer } from 'redux-persist';
// import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

import { LocalTaskTypes, LocalStateI } from '../types';
import { Reducer } from 'redux';

// const persistConfig = {
//   storage,
//   key: 'local',
//   stateReconciler: autoMergeLevel2,
// };

const initialState: LocalStateI = {
  activeItem: null,
  hoveredItem: null,
  showTaskMap: {},
  elmo: false,
  secondsPerItem: 300,
  socketIOClient: null,
  activeItemProgressTimer: null,
  addingTask: false,
  activeItemProgress: 0,
};

const reducer: Reducer<LocalStateI> = (state = initialState, task) => {
  switch (task.type) {
    case LocalTaskTypes.SET_ITEM:
      return {
        ...state,
        activeItem: task.activeItem,
      };

    case LocalTaskTypes.SET_HOVER_ITEM:
      return {
        ...state,
        hoveredItem: task.hoveredItem,
      };

    case LocalTaskTypes.UPDATE_SHOW_ACTION_MAP:
      return {
        ...state,
        showTaskMap: {
          ...state.showTaskMap,
          [task.itemID]: task.show,
        },
      };

    case LocalTaskTypes.UPDATE_SHOW_ADDING_ACTION:
      return {
        ...state,
        addingTask: task.addingTask,
      };

    case LocalTaskTypes.SET_ELMO:
      return {
        ...state,
        elmo: task.elmo,
      };

    case LocalTaskTypes.SET_ACTIVE_ITEM_PROGRESS:
      return {
        ...state,
        activeItemProgress: task.activeItemProgress,
      };

    case LocalTaskTypes.SET_ACTIVE_ITEM_PROGRESS_TIMER:
      return {
        ...state,
        activeItemProgressTimer: task.activeItemProgressTimer,
      };

    case LocalTaskTypes.SET_SOCKETIO_CLIENT:
      return {
        ...state,
        socketIOClient: task.socketIOClient,
      };

    default:
      return state;
  }
};

// export persistReducer<ApplicationState>(persistConfig, reducer);
export { reducer as LocalReducer };
