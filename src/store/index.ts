// @ts-nocheck
import { applyMiddleware, compose, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger/src";

import rootReducer from "./reducers";
import rootSaga from "./sagas";

const persistConfig = {
  key: 'hanbiro',
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = [sagaMiddleware];

if (process.env.NODE_ENV === "development") {
  middleware.push(logger);
}


export default () => {
  const store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(...middleware))
  );
  sagaMiddleware.run(rootSaga);
  
  const persistor = persistStore(store);

  return {store, persistor};
}
