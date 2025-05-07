import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './features/auth-slice';
import { baseApi } from './services/base-api';
// import { authApi } from './services/auth-api';
// import { collectionApi } from './services/collection-api';
// import { pinApi } from './services/pin-api';
// import { userApi } from './services/user-api';

// const apiMiddlewares = new Set([authApi.middleware, collectionApi.middleware, pinApi.middleware, userApi.middleware]);

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware),
});
