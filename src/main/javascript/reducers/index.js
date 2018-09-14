import { combineReducers } from 'redux';
import teamReducer from './teamReducer';
import boardReducer from './boardReducer';
import localReducer from './localReducer';
import userReducer from './userReducer';

export default combineReducers({
  teams: teamReducer,
  boards: boardReducer,
  local: localReducer,
  users: userReducer,
});
