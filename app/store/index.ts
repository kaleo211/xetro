import { combineReducers } from "redux";
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { BoardReducer } from "./board/reducer";
import { GroupReducer } from "./group/reducer";
import { LocalReducer } from "./local/reducer";
import { UserReducer } from "./user/reducer";

const rootReducer = combineReducers({
	board: BoardReducer,
	group: GroupReducer,
	local: LocalReducer,
	user: UserReducer,
});

export const store = createStore(rootReducer, {}, applyMiddleware(thunk));
