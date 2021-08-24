import { combineReducers } from "redux";
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


import { BoardReducer } from "./board/reducer";
import { GroupReducer } from "./group/reducer";
import { LocalReducer } from "./local/reducer";
import { UserReducer } from "./user/reducer";
import persistStore from "redux-persist/es/persistStore";


const userPersistConfig = {
  key: 'user',
  storage: storage,
  blacklist: ['somethingTemporary']
}

const rootReducer = combineReducers({
	board: BoardReducer,
	group: GroupReducer,
	local: LocalReducer,
  user: persistReducer(userPersistConfig, UserReducer),
});

export const store = createStore(rootReducer, {}, applyMiddleware(thunk));
export const persistor = persistStore(store);
