import {combineReducers} from 'redux';
import sessionReducer from './session';
import {persistReducer} from 'redux-persist';
import localforage from 'localforage';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

// const isRemember = async()=> await getValue(REMEBER_DATA)

const rootPersistConfig = {
  key: 'root',
  version: 1, //New version 0, default or previous version -1
  storage: localforage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['session', 'test'],
};

const sessionPersistConfig = {
  key: 'session',
  storage: localforage,
  stateReconciler: autoMergeLevel2,
  whitelist: [ ]
};

const testPersistConfig = {
  key: 'test',
  storage: localforage,
  stateReconciler: autoMergeLevel2,
  whitelist: [ ],
};

const rootReducer: any = combineReducers({
  session: persistReducer(sessionPersistConfig, sessionReducer),
});

export default persistReducer(rootPersistConfig, rootReducer);
