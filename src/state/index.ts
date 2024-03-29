import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { load, save } from "redux-localstorage-simple";
import application from "./application/reducer";
import user from "./user/reducer";
import connection from "./connection/reducer";
import contract from "./contract/reducer";
import transactions from "./transactions/reducer";
import lists from "./lists/reducer";
import proposal from "./proposal/reducer";
import deploy from "./deploy/reducer";
import multicall from "state/multicall";
import flow from "./flow/reducer";
import tempdata from "./tempdata/reducer";
import dashboard from './dashboard/reducer';

const PERSISTED_KEYS: string[] = ["user", "transactions", "lists"];

const store = configureStore({
  reducer: {
    application,
    user,
    connection,
    transactions,
    proposal,
    flow,
    tempdata,
    contract,
    deploy,
    lists,
    dashboard,
    multicall: multicall.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
    }).concat(save({ states: PERSISTED_KEYS, debounce: 1000 })),
  preloadedState: load({
    states: PERSISTED_KEYS,
    disableWarnings: process.env.NODE_ENV === "test",
  }),
});

setupListeners(store.dispatch);

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
