import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import { reducer } from './reducer';
import { WalletReducer } from "wan-dex-sdk-wallet";

const composeEnhancers =
  process.env.NODE_ENV === 'development' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const enhancer = composeEnhancers(applyMiddleware(...[thunk]));

const reducers = {
  global: reducer,
  WalletReducer
};

export const store = createStore(combineReducers(reducers), enhancer);

export function registerReducer(key, reducer) {
  reducers[key] = reducer;
  store.replaceReducer(combineReducers(reducers));
}

window.isMobile = /applewebkit.*mobile.*/.test(window.navigator.userAgent.toLowerCase());