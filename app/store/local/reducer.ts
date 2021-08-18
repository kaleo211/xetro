// import storage from 'redux-persist/lib/storage';
// import { persistReducer } from 'redux-persist';
// import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

import { LocalActionTypes, LocalStateI } from '../types';
import { Reducer } from 'redux';

// const persistConfig = {
//   storage,
//   key: 'local',
//   stateReconciler: autoMergeLevel2,
// };

const initialState: LocalStateI = {
  page: 'home',
  activeItem: null,
  hoveredItem: null,
  showActionMap: null,
  elmo: false,
  secondsPerItem: 300,
  socketIOClient: null,
  activeItemProgressTimer: null,
  addingAction: false,
  activeItemProgress: 0,
};

const reducer: Reducer<LocalStateI> = (state = initialState, action) => {
  switch (action.type) {
    case LocalActionTypes.SET_PAGE:
      return {
        ...state,
        page: action.page,
      };

    case LocalActionTypes.SET_ITEM:
      return {
        ...state,
        activeItem: action.activeItem,
      };

    case LocalActionTypes.SET_HOVER_ITEM:
      return {
        ...state,
        hoveredItem: action.hoveredItem,
      };

    case LocalActionTypes.UPDATE_SHOW_ACTION_MAP:
      return {
        ...state,
        showActionMap: {
          ...state.showActionMap,
          [action.itemID]: action.show,
        },
      };

    case LocalActionTypes.UPDATE_SHOW_ADDING_ACTION:
      return {
        ...state,
        addingAction: action.addingAction,
      };

    case LocalActionTypes.SET_ELMO:
      return {
        ...state,
        elmo: action.elmo,
      };

    case LocalActionTypes.SET_ACTIVE_ITEM_PROGRESS:
      return {
        ...state,
        activeItemProgress: action.activeItemProgress,
      };

    case LocalActionTypes.SET_ACTIVE_ITEM_PROGRESS_TIMER:
      return {
        ...state,
        activeItemProgressTimer: action.activeItemProgressTimer,
      };

    case LocalActionTypes.SET_SOCKETIO_CLIENT:
      return {
        ...state,
        socketIOClient: action.socketIOClient,
      };

    default:
      return state;
  }
};

// export persistReducer<ApplicationState>(persistConfig, reducer);
export { reducer as LocalReducer };
