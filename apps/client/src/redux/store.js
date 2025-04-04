import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./features/auth-slice";
import { authApi } from "./services/auth-api";
import { collectionApi } from "./services/collection-api";
import { pinApi } from "./services/pin-api";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [collectionApi.reducerPath]: collectionApi.reducer,
    [pinApi.reducerPath]: pinApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat([authApi.middleware, collectionApi.middleware, pinApi.middleware])
});
