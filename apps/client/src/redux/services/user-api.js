import { setAuthenticate } from '../features/auth-slice';
import { baseApi } from './base-api';

export const userApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    updateUser: builder.mutation({
      query: ({ args, userId }) => ({
        url: `/user/${userId}`,
        method: 'PATCH',
        body: args,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const result = await queryFulfilled;
          const user = result.data?.data;
          if (!user) return;
          const currentAccessToken = getState().auth.accessToken;
          dispatch(setAuthenticate({ user, accessToken: currentAccessToken }));
        } catch (error) {}
      },
    }),
  }),
});

export const { useUpdateUserMutation } = userApi;
