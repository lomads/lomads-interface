import {combineReducers} from 'redux';
import SessionReducer from './session';
import {persistReducer} from 'redux-persist';
import localforage from 'localforage';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

// const isRemember = async()=> await getValue(REMEBER_DATA)

console.log("SessionReducer", SessionReducer)

const rootPersistConfig = {
  key: 'root',
  version: 0,
  storage: localforage,
  stateReconciler: autoMergeLevel2,
  whitelist: [],
};

const sessionPersistConfig = {
  key: 'session',
  storage: localforage,
  stateReconciler: autoMergeLevel2,
  whitelist: ["token"]
};

const rootReducer: any = combineReducers({
  session: SessionReducer//persistReducer(sessionPersistConfig, sessionReducer),
});

export default persistReducer(rootPersistConfig, rootReducer);
