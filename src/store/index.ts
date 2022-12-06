import { applyMiddleware, compose } from 'redux';
import { legacy_createStore as createStore} from 'redux'
import rootReducer from 'store/reducers';
import createSagaMiddleware from 'redux-saga';
import sessionSaga from 'store/sagas/session.saga';
import { persistStore } from 'redux-persist';

//export let persistor: any = null;

const configureStore = (initialState: any = {}) => {
  const middlewares = [];

  const sagaMiddleware = createSagaMiddleware();
  middlewares.push(sagaMiddleware);

  const middlewareEnhancer = applyMiddleware(...middlewares);
  const enhancers = [middlewareEnhancer];
  const composedEnhancers: any = compose(...enhancers)
  const store = createStore(rootReducer, initialState, composedEnhancers);
  sagaMiddleware.run(sessionSaga);
  const persistor = persistStore(store);
  return { persistor, store };
};

export default configureStore
