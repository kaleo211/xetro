import { combineReducers } from 'redux';
import groupReducer from './groupReducer';
import boardReducer from './boardReducer';
import localReducer from './localReducer';
import userReducer from './userReducer';

export default combineReducers({
  groups: groupReducer,
  boards: boardReducer,
  local: localReducer,
  users: userReducer,
});
