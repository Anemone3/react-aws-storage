import { clearAuthenticate, setAuthenticate } from '../features/auth-slice';
import { baseApi } from './base-api';

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: credentials => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(clearAuthenticate());
          setTimeout(() => {
            dispatch(authApi.util.resetApiState());
          }, 1000);
        } catch (error) {
          console.log(error);
          dispatch(authApi.util.resetApiState());
        }
      },
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: '/auth/token',
        method: 'POST',
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          // console.log("refreshToken desde el onQueryStarted authApiSlice");
          const { data: resultRefreshToken } = await queryFulfilled;

          if (!resultRefreshToken) return;

          const { accessToken, data } = resultRefreshToken;
          dispatch(
            setAuthenticate({
              accessToken: accessToken,
              user: data,
            }),
          );
        } catch (error) {
          dispatch(authApi.util.resetApiState());
        }
      },
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useRefreshTokenMutation, useSendLogoutMutation } = authApi;
