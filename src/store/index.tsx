import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from 'store/reducers';
import createSagaMiddleware from 'redux-saga';
import sessionSaga from 'store/sagas/session.saga';
//import monitorReducerEnhancer from '@store/enhancers/monitorReducer';
import { persistStore } from 'redux-persist';
// import { defaultRestClient } from '../utils/restClient';

export let persistor: any = null;

const configureStore = (initialState: any = {}) => {
  const middlewares = [];

  const sagaMiddleware = createSagaMiddleware();
  middlewares.push(sagaMiddleware);

  const middlewareEnhancer = applyMiddleware(...middlewares);
  const enhancers = [middlewareEnhancer];
  const composedEnhancers: any = compose(...enhancers)
  const store = createStore(rootReducer, initialState, composedEnhancers);
  sagaMiddleware.run(sessionSaga);
  persistor = persistStore(store);
  return store;
};

export default configureStore
