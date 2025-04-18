import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './features/auth-slice';
import { authApi } from './services/auth-api';
import { collectionApi } from './services/collection-api';
import { pinApi } from './services/pin-api';
import { userApi } from './services/user-api';

const apiMiddlewares = [authApi.middleware, collectionApi.middleware, pinApi.middleware, userApi.middleware];

const uniqueMiddlewares = [...new Set(apiMiddlewares)];
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [collectionApi.reducerPath]: collectionApi.reducer,
    [pinApi.reducerPath]: pinApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(uniqueMiddlewares),
});
