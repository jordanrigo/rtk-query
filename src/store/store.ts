import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { emptySplitApi } from "./emptyApi";
import { rtkQueryErrorLogger } from "./errorMiddleware";
import authReducer from "./auth.slice";
import { authApi } from "../services/authApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [emptySplitApi.reducerPath]: emptySplitApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      emptySplitApi.middleware,
      authApi.middleware,
      rtkQueryErrorLogger
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
